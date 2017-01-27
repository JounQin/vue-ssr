import fs from 'fs'

import Koa from 'koa'
import logger from 'koa-logger'
import Router from 'koa-router'
import serve from 'koa-static'
import lruCache from 'lru-cache'
import _debug from 'debug'
import HtmlWriterStream from './html-writer-stream'
import intercept from './intercept'

import config, {globals, paths} from '../build/config'
import dev from './dev-tools'

const debug = _debug('hi:server')

const app = new Koa()

let indexHTML
let renderer

// https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
const createRenderer = bundle => require('vue-server-renderer').createBundleRenderer(bundle, {
  cache: lruCache({
    max: 1000,
    maxAge: 1000 * 60 * 15
  })
})

function parseIndex(template) {
  const contentMarker = '<!--APP-->'
  const index = template.indexOf(contentMarker)
  return {
    header: template.slice(0, index),
    footer: template.slice(index + contentMarker.length)
  }
}

app.use(logger())

const router = new Router()

router.get('*', async(ctx, next) => {
  const {req, res} = ctx

  if (!renderer) {
    return res.end('waiting for compilation... refresh in a moment.')
  }

  if (intercept(ctx, {logger: debug})) return await next()

  const context = {url: req.url}
  const renderStream = renderer.renderToStream(context)
  ctx.body = renderStream.pipe(new HtmlWriterStream(indexHTML))

  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Server', `koa/${require('koa/package.json').version}; ` +
    `vue-server-renderer/${require('vue-server-renderer/package.json').version}`)
})

app.use(router.routes())
  .use(router.allowedMethods())

if (globals.__DEV__) {
  dev(app, {
    bundleUpdated: bundle => (renderer = createRenderer(bundle)),
    indexUpdated: index => (indexHTML = parseIndex(index))
  })
} else {
  renderer = createRenderer(fs.readFileSync(paths.dist('server-bundle.js'), 'utf-8'))
  indexHTML = parseIndex(fs.readFileSync(paths.dist('index.html'), 'utf-8'))
}

app.use(serve('dist'))

const {serverHost, serverPort} = config

const args = [serverPort, serverHost]

export default app.listen(...args, err =>
  debug(...err ? [err] : ['Server is now running at %s:%s.', ...args.reverse()]))
