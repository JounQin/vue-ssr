import Koa from 'koa'
import logger from 'koa-logger'
import _debug from 'debug'

import config, {globals} from '../build/config'
import dev from './dev-tools'

const debug = _debug('hi:server')

const app = new Koa()

app.use(logger())

globals.__DEV__ ? dev(app) : ''

const {serverHost, serverPort} = config

export default app.listen(serverPort, serverHost, err => debug(err || ''))
