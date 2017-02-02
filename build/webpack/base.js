import 'babel-polyfill'
import webpack from 'webpack'

import config, {alias, globals, paths} from '../config'

import {
  commonLoaders,
  vueLoaders,
  localIdentName,
  nodeModules,
  cssLoader,
  cssModuleLoader,
  generateLoaders
} from './utils'

const {__DEV__, __PROD__} = globals

const PACKAGES = paths.base('packages')
const NODE_MODULES = 'node_modules'

const {devTool, minimize} = config

export const STYLUS_LOADER = 'stylus-loader'

export const prodEmpty = str => __PROD__ ? '' : str

const filename = `${prodEmpty('[name].')}[${config.hashType}].js`

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
  output: {
    path: paths.dist(),
    publicPath: config.publicPath,
    filename,
    chunkFilename: filename
  },
  devtool: devTool,
  module: {
    rules: [
      ...commonLoaders({
        exclude: ['styl']
      }),
      {
        test: /^(?!.*[/\\](app|bootstrap|theme-\w+)\.styl$).*\.styl$/,
        loader: generateLoaders(cssModuleLoader, STYLUS_LOADER),
        exclude: nodeModules
      },
      {
        test: /\.styl$/,
        use: generateLoaders(cssLoader, STYLUS_LOADER),
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
          loaders: vueLoaders(),
          cssModules: {
            camelCase: true,
            localIdentName
          }
        }
      }, {
        test: /\.pug$/,
        loader: `vue-template-es2015-loader!template-file-loader?raw&pretty=${__DEV__}&doctype=html`,
        exclude: nodeModules
      }, {
        test: /\.(png|jpe?g|gif)$/,
        loader: `url-loader?limit=10000&name=${prodEmpty('[name].')}[hash].[ext]!img-loader?minimize&progressive=true`
      },
      {
        test: /\.(svg|woff2?|eot|ttf)$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: `${prodEmpty('[name].')}[hash].[ext]`
        }
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize,
      stylus: {
        default: {
          preferPathResolver: 'webpack',
          import: [paths.src('styles/_variables.styl')]
        }
      }
    })
  ]
}
