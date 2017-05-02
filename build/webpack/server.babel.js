import webpack from 'webpack'
import BabiliPlugin from 'babili-webpack-plugin'
import VueSSRServerPlugin from 'vue-server-renderer/server-plugin'
import nodeExternals from 'webpack-node-externals'
import _debug from 'debug'

import config, {globals, paths} from '../config'
import {nodeModules, baseLoaders, generateLoaders} from './utils'

import baseConfig, {STYLUS_LOADER} from './base'

const {__PROD__, NODE_ENV} = globals

const VUE_ENV = process.env.VUE_ENV = 'server'

const debug = _debug('hi:webpack:server')

debug(`create webpack configuration for NODE_ENV:${NODE_ENV}, VUE_ENV:${VUE_ENV}`)

export default {
  ...baseConfig,
  target: 'node',
  devtool: '#source-map',
  entry: [baseConfig.entry, paths.src('entry-server')],
  module: {
    rules: [
      ...baseConfig.module.rules,
      {
        test: /[/\\](app|bootstrap)\.styl$/,
        loader: __PROD__ ? 'null-loader' : generateLoaders(STYLUS_LOADER, baseLoaders),
        exclude: nodeModules
      }, {
        test: /[/\\]theme-\w+\.styl$/,
        loader: generateLoaders(STYLUS_LOADER, baseLoaders),
        exclude: nodeModules
      }
    ]
  },
  output: {
    ...baseConfig.output,
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    ...baseConfig.plugins,
    new webpack.DefinePlugin({
      ...globals,
      'process.env.VUE_ENV': JSON.stringify(VUE_ENV),
      __SERVER__: true,
      SERVER_PREFIX: JSON.stringify(config.publicPath),
      INNER_SERVER: JSON.stringify(config.innerServer)
    }),
    new BabiliPlugin(),
    new VueSSRServerPlugin()
  ],
  externals: nodeExternals({
    // do not externalize CSS files in case we need to import it from a dep
    whitelist: /\.css$/
  })
}
