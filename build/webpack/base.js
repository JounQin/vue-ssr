import webpack from 'webpack'

import config, {globals, paths, vendors} from '../config'

const PACKAGES = paths.base('packages')
const NODE_MODULES = 'node_modules'

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
    app: [paths.src('entry-client')],
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
    new webpack.DefinePlugin(globals)
  ]
}

export default webpackConfig
