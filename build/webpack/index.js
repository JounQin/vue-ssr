import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import pug from 'pug'
import _debug from 'debug'

import config, {globals, paths, pkg, vendors} from '../config'

const debug = _debug('hi:webpack-config')

const {__DEV__, NODE_ENV, VUE_ENV} = globals

debug(`create webpack configuration for NODE_ENV:${NODE_ENV}, VUE_ENV:${VUE_ENV}`)

const PACKAGES = paths.base('packages')
const NODE_MODULES = 'node_modules'

const ENTRY_PATH = paths.src(`entry-${VUE_ENV}`)

const filename = `[name].[${config.hashType}].js`

const webpackConfig = {
  resolve: {
    modules: [paths.src(), PACKAGES, NODE_MODULES],
    extensions: ['.vue', '.js', '.styl'],
    enforceExtension: false,
    enforceModuleExtension: false
  },
  resolveLoader: {
    modules: [PACKAGES, NODE_MODULES]
  },
  entry: {
    app: __DEV__ ? [ENTRY_PATH, 'webpack-hot-middleware/client'] : ENTRY_PATH,
    vendors
  },
  output: {
    path: paths.dist(),
    publicPath: config.publicPath,
    filename,
    chunkFilename: filename
  },
  devtool: config.devTool,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /\bnode_modules\b/
      },
      {
        test: /\.styl/,
        use: ['style-loader', 'css-loader', 'stylus-loader']
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {}
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(globals),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      chunks: ['vendors']
    }),
    new HtmlWebpackPlugin({
      templateContent: pug.renderFile(paths.src('index.pug'), {
        pretty: !config.minify,
        title: `${pkg.name} - ${pkg.description}`
      })
    })
  ]
}

if (__DEV__) {
  debug('Enable plugins for live development (HMR, NoErrors).')

  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin())
} else {
  debug(`Enable plugins for ${NODE_ENV} (OccurenceOrder, Dedupe & UglifyJS).`)
  debug(`Extract styles of app and bootstrap for ${NODE_ENV}.`)
}

export default webpackConfig
