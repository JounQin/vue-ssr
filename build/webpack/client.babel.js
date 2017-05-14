import webpack from 'webpack'
import pug from 'pug'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin'
import VueSSRClientPlugin from 'vue-server-renderer/client-plugin'
import _debug from 'debug'

import config, {globals, paths, pkg} from '../config'
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
  entry: [baseConfig.entry, paths.src('entry-client')],
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
      __SERVER__: false,
      SERVER_PREFIX: JSON.stringify(config.publicPath),
      INNER_SERVER: JSON.stringify(config.innerServer)
    }),
    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        // a module is extracted into the vendor chunk if...
        return (
          // it's inside node_modules
          /node_modules/.test(module.context) &&
          // and not a CSS file (due to extract-text-webpack-plugin limitation)
          !/\.css$/.test(module.request)
        )
      }
    }),
    // extract webpack runtime & manifest to avoid vendor chunk hash changing
    // on every build.
    new webpack.optimize.CommonsChunkPlugin('manifest'),
    new HtmlWebpackPlugin({
      templateContent: pug.renderFile(paths.src('index.pug'), {
        pretty: !minimize,
        title: `${pkg.name} - ${pkg.description}`,
        polyfill: !__DEV__
      }),
      hash: false,
      inject: true,
      minify: {
        collapseWhitespace: minimize,
        minifyJS: minimize
      }
    }),
    new VueSSRClientPlugin()
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
      minify: true,
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/index\.html$/, /\.map$/, /\.json$/],
      stripPrefix: paths.dist().replace(/\\/g, '/'),
      runtimeCaching: [
        {
          urlPattern: /\/(test|article(s|\/\d+))?$/,
          handler: 'networkFirst'
        }
      ]
    })
  )
}

export default clientConfig
