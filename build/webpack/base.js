import webpack from 'webpack'
import _debug from 'debug'

import config, {globals, paths, vendors} from '../config'

const debug = _debug('hi:webpack:base')

const PACKAGES = paths.base('packages')
const NODE_MODULES = 'node_modules'

const filename = `[name].[${config.hashType}].js`

const {devTool, minify} = config
const {NODE_ENV} = globals

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
    app: [paths.src('entry-client')],
    vendors
  },
  output: {
    path: paths.dist(),
    publicPath: config.publicPath,
    filename,
    chunkFilename: filename
  },
  devtool: devTool,
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
        use: 'vue-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(globals),
    new webpack.LoaderOptionsPlugin({
      minimize: minify
    })
  ]
}

const sourceMap = !!devTool

if (minify) {
  debug(`Enable plugins for ${NODE_ENV} (OccurenceOrder, Dedupe & UglifyJS).`)

  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    mangle: !sourceMap,
    compress: {
      unused: true,
      dead_code: true,
      warnings: false
    },
    comments: false,
    sourceMap
  }))
}

export default webpackConfig
