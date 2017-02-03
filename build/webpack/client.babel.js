import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin'
import pug from 'pug'
import _debug from 'debug'

import config, {globals, paths, pkg, vendors} from '../config'
import {nodeModules, baseLoaders, generateLoaders} from './utils'

import baseConfig, {STYLUS_LOADER, prodEmpty} from './base'

const {devTool, minimize} = config

const sourceMap = !!devTool

const {__DEV__, NODE_ENV} = globals

const VUE_ENV = 'client'

const debug = _debug('hi:webpack:client')

debug(`create webpack configuration for NODE_ENV:${NODE_ENV}, VUE_ENV:${VUE_ENV}`)

let appLoader, bootstrapLoader

const clientConfig = {
  ...baseConfig,
  target: 'web',
  entry: {
    app: [paths.src('entry-client')],
    vendors
  },
  module: {
    rules: [
      ...baseConfig.module.rules,
      {
        test: /[/\\]app\.styl$/,
        loader: generateLoaders(STYLUS_LOADER, baseLoaders, {
          extract: minimize && (appLoader = new ExtractTextPlugin(`${prodEmpty('app.')}[contenthash].css`))
        }),
        exclude: nodeModules
      }, {
        test: /[/\\]bootstrap\.styl$/,
        loader: generateLoaders(STYLUS_LOADER, baseLoaders, {
          extract: minimize && (bootstrapLoader = new ExtractTextPlugin(`${prodEmpty('bootstrap.')}[contenthash].css`))
        }),
        exclude: nodeModules
      }, {
        test: /[/\\]theme-\w+\.styl$/,
        loader: generateLoaders(STYLUS_LOADER, baseLoaders),
        exclude: nodeModules
      }
    ]
  },
  plugins: [
    ...baseConfig.plugins,
    new webpack.DefinePlugin({
      ...globals,
      __SERVER__: false
    }),
    new webpack.optimize.CommonsChunkPlugin('vendors'),
    new HtmlWebpackPlugin({
      templateContent: pug.renderFile(paths.src('index.pug'), {
        pretty: !minimize,
        title: `${pkg.name} - ${pkg.description}`,
        polyfill: !__DEV__
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

if (minimize) {
  debug(`Enable plugins for ${NODE_ENV} (UglifyJS).`)

  clientConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      mangle: !sourceMap,
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      },
      comments: false,
      sourceMap
    }),
    bootstrapLoader,
    appLoader
  )
}

if (__DEV__) {
  debug('Enable plugins for live development (HMR, NoErrors).')

  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  debug(`Extract styles of app and bootstrap for ${NODE_ENV}.`)

  debug(`Enable plugins for ${NODE_ENV} (SWPrecache).`)
  clientConfig.plugins.push(
    new SWPrecacheWebpackPlugin({
      cacheId: 'vue-ssr',
      filename: 'service-worker.js',
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/index\.html$/, /\.map$/]
    })
  )
}

export default clientConfig
