import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import pug from 'pug'
import _debug from 'debug'

import config, {globals, paths, pkg, vendors} from '../config'

const {minimize} = config

const {__DEV__, NODE_ENV} = globals

const VUE_ENV = 'client'

const debug = _debug('hi:webpack:client')

debug(`create webpack configuration for NODE_ENV:${NODE_ENV}, VUE_ENV:${VUE_ENV}`)

import baseConfig from './base'

const clientConfig = {
  ...baseConfig,
  target: 'web',
  entry: {
    app: [paths.src('entry-client')],
    vendors
  },
  plugins: [
    ...baseConfig.plugins,
    new webpack.DefinePlugin({
      ...globals,
      __SERVER__: false
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      chunks: ['vendors']
    }),
    new HtmlWebpackPlugin({
      templateContent: pug.renderFile(paths.src('index.pug'), {
        pretty: !minimize,
        title: `${pkg.name} - ${pkg.description}`
      }),
      favicon: paths.src('static/favicon.ico'),
      hash: false,
      inject: true,
      minify: {
        collapseWhitespace: minimize,
        minifyJS: minimize
      }
    })
  ]
}

if (__DEV__) {
  debug('Enable plugins for live development (HMR, NoErrors).')

  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin())
} else {
  debug(`Extract styles of app and bootstrap for ${NODE_ENV}.`)
}

export default clientConfig
