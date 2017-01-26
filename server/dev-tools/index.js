import webpack from 'webpack'
import devMiddleware from './webpack-dev'
import hotMiddleware from './webpack-hot'
import config from '../../build/webpack'

export default app => {
  const compiler = webpack(config)
  app.use(devMiddleware(compiler))
  app.use(hotMiddleware(compiler))
}
