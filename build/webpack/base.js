import webpack from 'webpack'

import config, {alias, paths} from '../config'

import {commonLoaders, vueLoaders, localIdentName, nodeModules} from './utils'

const PACKAGES = paths.base('packages')
const NODE_MODULES = 'node_modules'

const filename = `[name].[${config.hashType}].js`

const {devTool, minimize} = config

export default {
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
      ...commonLoaders(),
      {
        test: /\.js$/,
        use: 'babel-loader?cacheDirectory',
        exclude: nodeModules
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: vueLoaders(),
          cssModules: {
            camelCase: true,
            localIdentName
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize
    })
  ]
}
