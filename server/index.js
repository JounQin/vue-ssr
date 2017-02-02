import fs from 'fs'

import Koa from 'koa'
import compress from 'koa-compress'
import logger from 'koa-logger'
import Router from 'koa-router'
import serve from 'koa-static'
import onerror from '../packages/koa-onerror'
import lruCache from 'lru-cache'
import HTMLStream from 'vue-ssr-html-stream'
import _debug from 'debug'

import intercept from './intercept'

import config, {globals, paths} from '../build/config'

const {__DEV__} = globals

const debug = _debug('hi:server')

const app = new Koa()

onerror(app)

app.on('error', (err, ctx) => {
  const {status, originalError} = err

  switch (status) {
    case 404:
      ctx.status = status
      ctx.res.end('404 | Page Not Found')
      break
  }

  debug(originalError || err)
})

let template
let renderer

// https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
const createRenderer = bundle => require('../packages/vue-server-renderer').createBundleRenderer(bundle, {
  cache: lruCache({
    max: 1000,
    maxAge: 1000 * 60 * 15
  })
})

app.use(compress())
app.use(logger())

const router = new Router()

router.get('*', async(ctx, next) => {
  const {req, res} = ctx

  if (!renderer || !template) return res.end('waiting for compilation... refresh in a moment.')

  if (intercept(ctx, {logger: __DEV__ && debug})) return await next()

  const start = Date.now()

  const context = {url: req.url}
  const htmlStream = new HTMLStream({template, context, contentPlaceholder: '<!--APP-->'})

  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Server', `koa/${require('koa/package.json').version}; ` +
    `vue-server-renderer/${require('vue-server-renderer/package.json').version}`)

  ctx.body = renderer.renderToStream(context)
    .on('error', ctx.onerror)
    .pipe(htmlStream)
    .on('end', () => console.log(`whole request: ${Date.now() - start}ms`))
})

app.use(router.routes()).use(router.allowedMethods())

if (__DEV__) {
  require('./dev-tools').default(app, {
    bundleUpdated: bundle => (renderer = createRenderer(bundle)),
    templateUpdated: temp => (template = temp)
  })
} else {
  renderer = createRenderer(require(paths.dist('vue-ssr-bundle.json'), 'utf-8'))
  template = fs.readFileSync(paths.dist('index.html'), 'utf-8')
  app.use(serve('dist'))
}

const {serverHost, serverPort} = config

const args = [serverPort, serverHost]

export default app.listen(...args, err =>
  debug(...err ? [err] : ['Server is now running at %s:%s.', ...args.reverse()]))
