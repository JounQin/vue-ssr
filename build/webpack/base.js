import webpack from 'webpack'
import _debug from 'debug'

import config, {alias, globals, paths} from '../config'

const debug = _debug('hi:webpack:base')

const PACKAGES = paths.base('packages')
const NODE_MODULES = 'node_modules'

const filename = `[name].[${config.hashType}].js`

const {devTool, minimize} = config
const {NODE_ENV} = globals

const webpackConfig = {
  resolve: {
    modules: [paths.src(), PACKAGES, NODE_MODULES],
    extensions: ['.vue', '.js', '.styl'],
    enforceExtension: false,
    enforceModuleExtension: false,
    alias
  },
  resolveLoader: {
    modules: [PACKAGES, NODE_MODULES]
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
        use: 'babel-loader?cacheDirectory',
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
    new webpack.LoaderOptionsPlugin({
      minimize
    })
  ]
}

const sourceMap = !!devTool

if (minimize) {
  debug(`Enable plugins for ${NODE_ENV} (UglifyJS).`)

  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
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
