import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import pug from 'pug'
import _debug from 'debug'

import config, {globals, paths, pkg} from '../config'

const {minify} = config

const {__DEV__, NODE_ENV, VUE_ENV} = globals

const debug = _debug('hi:webpack:client')

debug(`create webpack configuration for NODE_ENV:${NODE_ENV}, VUE_ENV:${VUE_ENV}`)

import baseConfig from './base'

const clientConfig = {
  ...baseConfig,
  target: 'web'
}

clientConfig.plugins.push(
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors',
    chunks: ['vendors']
  }),
  new HtmlWebpackPlugin({
    templateContent: pug.renderFile(paths.src('index.pug'), {
      pretty: !minify,
      title: `${pkg.name} - ${pkg.description}`
    }),
    favicon: paths.src('static/favicon.ico'),
    hash: false,
    inject: true,
    minify: {
      collapseWhitespace: minify,
      minifyJS: minify
    }
  }))

if (__DEV__) {
  debug('Enable plugins for live development (HMR, NoErrors).')

  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin())
} else {
  debug(`Enable plugins for ${NODE_ENV} (OccurenceOrder, Dedupe & UglifyJS).`)
  debug(`Extract styles of app and bootstrap for ${NODE_ENV}.`)
}

export default clientConfig
