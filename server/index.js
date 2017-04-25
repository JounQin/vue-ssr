import fs from 'fs'

import Koa from 'koa'
import compress from 'koa-compress'
import logger from 'koa-logger'
import lruCache from 'lru-cache'
import HTMLStream from 'vue-ssr-html-stream'
import _debug from 'debug'

import router from './router'
import intercept from './intercept'

import config, {globals, paths} from '../build/config'

const {__DEV__} = globals

const debug = _debug('hi:server')

const app = new Koa()

app.use(compress()).use(logger())

router(app)

let renderer
let template

const koaVersion = require('koa/package.json').version
const vueVersion = require('vue-server-renderer/package.json').version

const DEFAULT_HEADERS = {
  'Content-Type': 'text/html',
  Server: `koa/${koaVersion}; vue-server-renderer/${vueVersion}`
}

app.use(async (ctx, next) => {
  if (!renderer || !template) {
    ctx.status = 200
    ctx.body = 'waiting for compilation... refresh in a moment.'
    return
  }

  if (intercept(ctx, {logger: __DEV__ && debug})) {
    await next()
    return
  }

  ctx.set(DEFAULT_HEADERS)

  const start = Date.now()

  const context = {url: ctx.url}

  ctx.body = renderer.renderToStream(context)
    .on('error', ctx.onerror)
    .pipe(new HTMLStream({
      template,
      context,
      outletPlaceholder: '<div id="app"></div>'
    }))
    .on('end', () => console.log(`whole request: ${Date.now() - start}ms`))
})

// https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
const createRenderer = bundle => require('vue-server-renderer').createBundleRenderer(bundle, {
  cache: lruCache({
    max: 1000,
    maxAge: 1000 * 60 * 15
  })
})

if (__DEV__) {
  require('./dev-tools').default(app, {
    bundleUpdated: bundle => (renderer = createRenderer(bundle)),
    templateUpdated: temp => (template = temp)
  })
} else {
  renderer = createRenderer(require(paths.dist('vue-ssr-bundle.json'), 'utf-8'))
  template = fs.readFileSync(paths.dist('index.html'), 'utf-8')
  app.use(require('koa-static')('dist'))
}

const {serverHost, serverPort} = config

const args = [serverPort, serverHost]

export default app.listen(...args, err =>
  debug(...err ? [err] : ['Server is now running at %s:%s.', ...args.reverse()]))
