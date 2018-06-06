import fs from 'fs'
import path from 'path'

import Koa from 'koa'
import compress from 'koa-compress'
import logger from 'koa-logger'
import serve from 'koa-static'
import lruCache from 'lru-cache'
import mkdirp from 'mkdirp'
import re from 'path-to-regexp'
import _debug from 'debug'

import router from './router'

import {
  resolve,
  runtimeRequire,
  serverHost,
  serverPort,
} from '../build/config'

const debug = _debug('hi:server')

const template =
  process.env.NODE_ENV === 'development'
    ? // tslint:disable-next-line:no-var-requires
      require('pug').renderFile(resolve('server/template.pug'), {
        pretty: true,
      })
    : fs.readFileSync(resolve('dist/template.html'), 'utf-8')

const app = new Koa()

app
  .use(compress())
  .use(logger())
  .use(serve(resolve('public')))

router(app)

let renderer
let readyPromise
let mfs

const koaVersion = require('koa/package.json').version
const vueVersion = require('vue-server-renderer/package.json').version

const INDEX_PAGE = '__non-ssr-page__.html'

const DEFAULT_HEADERS = {
  'Content-Type': 'text/html',
  Server: `koa/${koaVersion}; vue-server-renderer/${vueVersion}`,
}

const NON_SSR_PATTERN = ['/test']
const STATIC_PATTERN = ['/', '/articles', '/article/:id(\\d+)']

app.use(async (ctx, next) => {
  await readyPromise

  if (
    ctx.method !== 'GET' ||
    ctx.url.lastIndexOf('.') > ctx.url.lastIndexOf('/') ||
    !['*/*', 'text/html'].find(mimeType => ctx.get('Accept').includes(mimeType))
  ) {
    return next()
  }

  ctx.set(DEFAULT_HEADERS)

  const { url } = ctx

  if (NON_SSR_PATTERN.find(pattern => re(pattern).exec(url))) {
    if (process.env.NODE_ENV === 'development') {
      ctx.body = mfs.createReadStream(resolve('dist/' + INDEX_PAGE))
    } else {
      ctx.url = INDEX_PAGE
      await next()
    }
    return
  }

  let generateStatic, distPath

  if (
    process.env.NODE_ENV !== 'development' &&
    STATIC_PATTERN.find(pattern => re(pattern).exec(url))
  ) {
    const staticFile = url.split('?')[0].replace(/^\//, '') || 'home'
    const staticPath = `${staticFile}.html`

    // only /tmp folder is writable in now.sh
    const isNowSh = ctx.hostname.endsWith('.now.sh')
    distPath = isNowSh
      ? path.resolve('/tmp', staticPath)
      : resolve('dist/static/' + staticPath)

    if (mfs.existsSync(distPath)) {
      if (isNowSh) {
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

  const context = { ctx, title: 'vue-ssr' }

  let html = ''

  ctx.respond = false
  ctx.status = 200

  const { res } = ctx

  const stream = renderer
    .renderToStream(context)
    .on('error', e => {
      switch ((ctx.status = e.status || 500)) {
        case 302:
          ctx.redirect(e.url)
          return res.end()
        case 404:
          return res.end('404 | Page Not Found')
        default:
          res.end('500 | Internal Server Error')
          // eslint-disable-next-line no-console
          console.error(`error during render : ${url}`)
          // eslint-disable-next-line no-console
          console.error(e.stack)
      }
    })
    .on('end', () => {
      if (html) {
        try {
          mkdirp.sync(path.dirname(distPath), { fs: mfs })
          mfs.writeFileSync(distPath, html)
          debug(`static html file "${distPath}" is generated!`)
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e)
        }
      }
      debug(`whole request: ${Date.now() - start}ms`)
    })

  generateStatic && stream.on('data', data => (html += data))

  stream.pipe(res)
})

// https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
const createRenderer = (bundle, options) =>
  require('vue-server-renderer').createBundleRenderer(bundle, {
    ...options,
    template,
    inject: false,
    cache: lruCache({
      max: 1000,
      maxAge: 1000 * 60 * 15,
    }),
    basedir: resolve('dist/static'),
    runInNewContext: false,
  })

if (process.env.NODE_ENV === 'development') {
  const {
    readyPromise: ready,
    webpackMiddlewarePromise,
  } = require('./dev').default(({ bundle, clientManifest, fs }) => {
    renderer = createRenderer(bundle, { clientManifest, template })
    mfs = fs
  })

  readyPromise = ready
  webpackMiddlewarePromise.then(webpackMiddleware => app.use(webpackMiddleware))
} else {
  mfs = fs
  renderer = createRenderer(
    runtimeRequire(resolve('dist/vue-ssr-server-bundle.json')),
    {
      clientManifest: runtimeRequire(
        resolve('dist/vue-ssr-client-manifest.json'),
      ),
    },
  )
  app.use(serve('dist/static'))
}

const args = [serverPort, serverHost]

app.listen(...args, err =>
  debug(
    ...(err ? [err] : ['Server is now running at %s:%s.', ...args.reverse()]),
  ),
)
