import fs from 'fs'
import path from 'path'

import Koa from 'koa'
import compress from 'koa-compress'
import onerror from 'koa-onerror'
import logger from 'koa-logger'
import lruCache from 'lru-cache'
import mkdirp from 'mkdirp'
import pug from 'pug'
import re from 'path-to-regexp'
import _debug from 'debug'

import router from './router'
import intercept from './intercept'

import config, {globals, paths} from '../build/config'

const {__DEV__} = globals

const debug = _debug('hi:server')

const template = pug.renderFile(paths.server('template.pug'), {
  pretty: !config.minimize,
  polyfill: !__DEV__
})

const app = new Koa()

onerror(app)

app.use(compress()).use(logger())

router(app)

let renderer
let readyPromise
let mfs

const koaVersion = require('koa/package.json').version
const vueVersion = require('vue-server-renderer/package.json').version

const INDEX_PAGE = 'index.html'

const DEFAULT_HEADERS = {
  'Content-Type': 'text/html',
  Server: `koa/${koaVersion}; vue-server-renderer/${vueVersion}`
}

const NON_SSR_PATTERN = ['/test']
const STATIC_PATTERN = ['/', '/articles', '/article/:id(\\d+)']

app.use(async (ctx, next) => {
  await readyPromise

  if (intercept(ctx, {logger: __DEV__ && debug})) {
    await next()
    return
  }

  ctx.set(DEFAULT_HEADERS)

  const {url} = ctx

  if (NON_SSR_PATTERN.find(pattern => re(pattern).exec(url))) {
    if (__DEV__) {
      ctx.body = mfs.createReadStream(paths.dist(INDEX_PAGE))
    } else {
      ctx.url = INDEX_PAGE
      await next()
    }
    return
  }

  let generateStatic, distPath

  if (STATIC_PATTERN.find(pattern => re(pattern).exec(url))) {
    const staticFile = url.split('?')[0].replace(/^\//, '') || 'home'
    const staticPath = `static/${staticFile}.html`
    distPath = paths.dist(staticPath)

    if (mfs.existsSync(distPath)) {
      if (__DEV__) {
        ctx.body = mfs.createReadStream(distPath)
      } else {
        ctx.url = staticPath
        await next()
      }
      return
    }

    generateStatic = true
  }

  const start = Date.now()

  const context = {url, title: 'vue-ssr'}

  try {
    let stream

    await new Promise((resolve, reject) => {
      let first = true
      let html = ''
      stream = renderer.renderToStream(context)
        .on('data', data => {
          if (first) {
            first = false
            stream.pause()
            stream.unshift(data)
            resolve()
          }

          generateStatic && (html += data.toString())
        })
        .on('error', reject)
        .on('end', () => {
          if (html) {
            try {
              mkdirp.sync(path.dirname(distPath), {fs: mfs})
              mfs.writeFileSync(distPath, html)
            } catch (e) {
              console.error(e)
            }

            debug(`static html file "${distPath}" is generated!`)
          }
          debug(`whole request: ${Date.now() - start}ms`)
        })
    })

    ctx.body = stream.resume()
  } catch (e) {
    if (e.status === 404) {
      ctx.body = '404 | Page Not Found'
    } else {
      ctx.status = 500
      ctx.body = '500 | Internal Server Error'
      console.error(`error during render : ${url}`)
      console.error(e.stack)
    }
  }
})

// https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
const createRenderer = (bundle, options) => require('vue-server-renderer').createBundleRenderer(bundle, {
  ...options,
  template,
  inject: false,
  cache: lruCache({
    max: 1000,
    maxAge: 1000 * 60 * 15
  }),
  basedir: paths.dist(),
  runInNewContext: false
})

if (__DEV__) {
  readyPromise = require('./dev-tools').default(app, (bundle, {clientManifest, fs}) => {
    renderer = createRenderer(bundle, {clientManifest})
    mfs = fs
  })
} else {
  mfs = fs
  renderer = createRenderer(require(paths.dist('vue-ssr-server-bundle.json')), {
    clientManifest: require(paths.dist('vue-ssr-client-manifest.json'))
  })
  app.use(require('koa-static')('dist'))
}

const {serverHost, serverPort} = config

const args = [serverPort, serverHost]

app.listen(...args, err =>
  debug(...err ? [err] : ['Server is now running at %s:%s.', ...args.reverse()]))
