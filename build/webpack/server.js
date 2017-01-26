import {paths} from '../config'

import baseConfig from './base'

export default {
  ...baseConfig,
  target: 'node',
  devtool: false,
  entry: paths.src('entry-server'),
  output: {
    ...baseConfig.output,
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  }
}
