import nodeExternals from 'webpack-node-externals'
import merge from 'webpack-merge'

import { NODE_ENV, resolve } from './config'

import baseConfig, { babelLoader } from './base'

export default merge.smart(baseConfig, {
  mode: NODE_ENV,
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
})
