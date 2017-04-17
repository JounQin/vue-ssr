import webpack from 'webpack'
import BabiliPlugin from 'babili-webpack-plugin'
import VueSSRPlugin from 'vue-ssr-webpack-plugin'
import _debug from 'debug'

import config, {globals, paths, pkg} from '../config'
import {nodeModules, baseLoaders, generateLoaders} from './utils'

import baseConfig, {STYLUS_LOADER} from './base'

const {__PROD__, NODE_ENV} = globals

const VUE_ENV = process.env.VUE_ENV = 'server'

const debug = _debug('hi:webpack:server')

debug(`create webpack configuration for NODE_ENV:${NODE_ENV}, VUE_ENV:${VUE_ENV}`)

export default {
  ...baseConfig,
  target: 'node',
  devtool: false,
  entry: ['babel-polyfill', paths.src('entry-server')],
  module: {
    rules: [
      ...baseConfig.module.rules,
      {
        test: /[/\\](app|bootstrap)\.styl$/,
        loader: __PROD__ ? 'null-loader' : generateLoaders(STYLUS_LOADER, baseLoaders, {vue: true}),
        exclude: nodeModules
      }, {
        test: /[/\\]theme-\w+\.styl$/,
        loader: generateLoaders(STYLUS_LOADER, baseLoaders, {vue: true}),
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
    new VueSSRPlugin()
  ],
  externals: Object.keys(pkg.dependencies)
}
