import webpack from 'webpack'
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin'

import config, {alias, globals, paths} from '../config'

import {
  nodeModules,
  baseLoaders,
  cssModuleLoaders,
  commonCssLoaders,
  vueCssLoaders,
  localIdentName,
  generateLoaders
} from './utils'

const {__PROD__} = globals

const PACKAGES = paths.base('packages')
const NODE_MODULES = 'node_modules'

const {devTool, minimize} = config

export const STYLUS_LOADER = 'stylus-loader'

export const prodEmpty = str => __PROD__ ? '' : str

const filename = `${prodEmpty('[name].')}[${config.hashType}].js`

const sourceMap = !!devTool

const urlLoader = `url-loader?${JSON.stringify({
  limit: 10000,
  name: `${prodEmpty('[name].')}[hash].[ext]`
})}`

export default {
  resolve: {
    modules: [paths.src(), paths.src('components'), paths.src('views'), PACKAGES, NODE_MODULES],
    extensions: ['.vue', '.js', '.styl'],
    enforceExtension: false,
    enforceModuleExtension: false,
    alias
  },
  resolveLoader: {
    modules: [PACKAGES, NODE_MODULES]
  },
  entry: 'regenerator-runtime/runtime',
  output: {
    path: paths.dist(),
    publicPath: config.publicPath,
    filename,
    chunkFilename: filename
  },
  devtool: devTool,
  module: {
    rules: [
      ...commonCssLoaders({
        sourceMap,
        exclude: 'styl'
      }),
      {
        test: /^(?!.*[/\\](app|bootstrap|theme-\w+)\.styl$).*\.styl$/,
        loader: generateLoaders(STYLUS_LOADER, cssModuleLoaders),
        exclude: nodeModules
      },
      {
        test: /\.styl$/,
        loader: generateLoaders(STYLUS_LOADER, baseLoaders),
        include: nodeModules
      },
      {
        test: /\.js$/,
        use: 'babel-loader?cacheDirectory',
        exclude: nodeModules
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: vueCssLoaders({
            sourceMap
          }),
          cssModules: {
            camelCase: true,
            localIdentName
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: urlLoader + '!img-loader?minimize&progressive=true'
      },
      {
        test: /\.(svg|woff2?|eot|ttf)$/,
        loader: urlLoader
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize,
      stylus: {
        default: {
          import: paths.src('styles/_variables.styl'),
          paths: paths.base('node_modules/bootstrap-styl')
        }
      }
    }),
    new LodashModuleReplacementPlugin()
  ]
}
