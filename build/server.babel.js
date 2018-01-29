import nodeExternals from 'webpack-node-externals'
import UglifyjsWebpackPlugin from 'uglifyjs-webpack-plugin'

import { resolve } from './config'

import baseConfig, { babelLoader } from './base'

export default {
  ...baseConfig,
  entry: resolve('server/index.js'),
  target: 'node',
  output: {
    path: resolve('dist'),
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },
  externals: nodeExternals(),
  module: {
    rules: [babelLoader(true)],
  },
  plugins: [new UglifyjsWebpackPlugin()],
}
