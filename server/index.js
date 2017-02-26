import fs from 'fs'

import Koa from 'koa'
import compress from 'koa-compress'
import logger from 'koa-logger'
import lruCache from 'lru-cache'
import HTMLStream from '../packages/vue-ssr-html-stream'
import _debug from 'debug'

import intercept from './intercept'

import config, {globals, paths} from '../build/config'

const {__DEV__} = globals

const debug = _debug('hi:server')

const app = new Koa()

app.use(compress())
app.use(logger())

let renderer
let template

app.use(async(ctx, next) => {
  const {req, res} = ctx

  if (!renderer || !template) {
    ctx.status = 200
    return res.end('waiting for compilation... refresh in a moment.')
  }

  if (intercept(ctx, {logger: __DEV__ && debug})) return await next()

  const start = Date.now()

  const context = {url: req.url}
  const htmlStream = new HTMLStream({
    template,
    context,
    outletPlaceholder: '<div id="app"></div>',
    styleMode: !__DEV__
  })

  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Server', `koa/${require('koa/package.json').version}; ` +
    `vue-server-renderer/${require('vue-server-renderer/package.json').version}`)

  ctx.body = renderer.renderToStream(context)
    .on('error', ctx.onerror)
    .pipe(htmlStream)
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
