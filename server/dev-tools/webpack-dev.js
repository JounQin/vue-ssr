import applyExpressMiddleware from './apply-express-middleware'
import _debug from 'debug'

const debug = _debug('hi:webpack-dev')

export default (compiler, middleware) => {
  debug('Enable webpack dev middleware.')

  return async function koaWebpackDevMiddleware(ctx, next) {
    /* eslint prefer-const: 0 */
    let hasNext = await applyExpressMiddleware(middleware, ctx.req, {
      end(content) {
        ctx.body = content
      },
      setHeader() {
        ctx.set.apply(ctx, arguments)
      }
    })

    if (hasNext) {
      await next()
    }
  }
}
