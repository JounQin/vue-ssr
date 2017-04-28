import Koa from 'koa'
import compress from 'koa-compress'
import onerror from 'koa-onerror'
import logger from 'koa-logger'
import lruCache from 'lru-cache'
import pug from 'pug'
import _debug from 'debug'

import router from './router'
import intercept from './intercept'

import config, {globals, paths} from '../build/config'

const {__DEV__} = globals

const debug = _debug('hi:server')

const template = pug.renderFile(paths.src('index.pug'), {
  pretty: !config.minimize,
  polyfill: !__DEV__
})

const app = new Koa()

onerror(app)

app.use(compress()).use(logger())

router(app)

let renderer
let readyPromise

const koaVersion = require('koa/package.json').version
const vueVersion = require('vue-server-renderer/package.json').version

const DEFAULT_HEADERS = {
  'Content-Type': 'text/html',
  Server: `koa/${koaVersion}; vue-server-renderer/${vueVersion}`
}

app.use(async (ctx, next) => {
  __DEV__ && await readyPromise

  if (intercept(ctx, {logger: __DEV__ && debug})) {
    await next()
    return
  }

  ctx.set(DEFAULT_HEADERS)

  const start = Date.now()

  const context = {url: ctx.url, title: 'Vue Server Slide Rendering'}

  ctx.body = renderer.renderToStream(context)
    .on('error', e => ctx.onerror(e))
    .on('end', () => console.log(`whole request: ${Date.now() - start}ms`))
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
  readyPromise = require('./dev-tools').default(app, (bundle, options) => {
    renderer = createRenderer(bundle, options)
  })
} else {
  renderer = createRenderer(require(paths.dist('vue-ssr-server-bundle.json')), {
    clientManifest: require(paths.dist('vue-ssr-client-manifest.json'))
  })
  app.use(require('koa-static')('dist'))
}

const {serverHost, serverPort} = config

const args = [serverPort, serverHost]

export default app.listen(...args, err =>
  debug(...err ? [err] : ['Server is now running at %s:%s.', ...args.reverse()]))
