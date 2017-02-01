require('babel-register')
require('babel-polyfill')

const webpack = require('webpack')
const debug = require('debug')('hi:bin:compile')

debug('Create webpack compiler.')

const {clientConfig, serverConfig} = require('../webpack');

[clientConfig, serverConfig].forEach(config => {
  webpack(config).run((err, stats) => {
    const jsonStats = stats.toJson()

    debug('Webpack compile completed.')
    console.log(stats.toString({
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      colors: true
    }))

    if (err) {
      debug('Webpack compiler encountered a fatal error.', err)
      process.exit(1)
    } else if (jsonStats.errors.length > 0) {
      debug('Webpack compiler encountered errors.')
      console.log(jsonStats.errors)
      process.exit(1)
    } else if (jsonStats.warnings.length > 0) {
      debug('Webpack compiler encountered warnings.')
    } else {
      debug('No errors or warnings encountered.')
    }
  })
})
