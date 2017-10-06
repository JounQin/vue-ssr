import fs from 'fs'
import path from 'path'

import Koa from 'koa'
import compress from 'koa-compress'
import logger from 'koa-logger'
import serve from 'koa-static'
import lruCache from 'lru-cache'
import mkdirp from 'mkdirp'
import pug from 'pug'
import re from 'path-to-regexp'
import _debug from 'debug'
import {minify} from 'html-minifier'

import router from './router'
import intercept from './intercept'

import config, {globals, paths} from '../build/config'

const {__DEV__} = globals

const debug = _debug('hi:server')

const getTemplate = templatePath => {
  const tpl = pug.render(fs.readFileSync(templatePath, 'utf-8'), {
    pretty: !config.minimize,
    polyfill: !__DEV__
  })

  return config.minimize ? minify(tpl, {
    collapseWhitespace: true,
    minifyJS: true
  }) : tpl
}

const app = new Koa()

app.use(compress()).use(logger()).use(serve(paths.base('public')))

router(app)

let renderer
let readyPromise
let mfs

const templatePath = paths.server('template.pug')

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

    // only /tmp folder is writable in now.sh
    const isNowSh = ctx.hostname.endsWith('.now.sh')
    distPath = isNowSh ? path.resolve('/tmp', staticPath) : paths.dist(staticPath)

    if (mfs.existsSync(distPath)) {
      if (__DEV__ || isNowSh) {
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

  const context = {ctx, title: 'vue-ssr'}

  let html = ''

  ctx.respond = false
  ctx.status = 200

  const {res} = ctx

  const stream = renderer.renderToStream(context)
    .on('error', e => {
      switch (ctx.status = e.status || 500) {
        case 302:
          ctx.redirect(e.url)
          return res.end()
        case 404:
          return res.end('404 | Page Not Found')
        default:
          res.end('500 | Internal Server Error')
          console.error(`error during render : ${url}`)
          console.error(e.stack)
      }
    })
    .on('end', () => {
      if (html) {
        try {
          mkdirp.sync(path.dirname(distPath), {fs: mfs})
          mfs.writeFileSync(distPath, html)
          debug(`static html file "${distPath}" is generated!`)
        } catch (e) {
          console.error(e)
        }
      }
      debug(`whole request: ${Date.now() - start}ms`)
    })

  generateStatic && stream.on('data', data => (html += data))

  stream.pipe(res)
})

// https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
const createRenderer = (bundle, options) => require('vue-server-renderer').createBundleRenderer(bundle, {
  ...options,
  inject: false,
  cache: lruCache({
    max: 1000,
    maxAge: 1000 * 60 * 15
  }),
  basedir: paths.dist(),
  runInNewContext: false
})

if (__DEV__) {
  readyPromise = require('./dev-tools').default(app, templatePath, getTemplate, (bundle, {clientManifest, fs, template}) => {
    renderer = createRenderer(bundle, {clientManifest, template})
    mfs = fs
  })
} else {
  mfs = fs
  renderer = createRenderer(require(paths.dist('vue-ssr-server-bundle.json')), {
    clientManifest: require(paths.dist('vue-ssr-client-manifest.json')),
    template: getTemplate(templatePath)
  })
  app.use(serve('dist'))
}

const {serverHost, serverPort} = config

const args = [serverPort, serverHost]

app.listen(...args, err =>
  debug(...err ? [err] : ['Server is now running at %s:%s.', ...args.reverse()]))
