import path from 'path'

const NODE_ENV = process.env.NODE_ENV || 'development'

export const globals = {
  NODE_ENV,
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  __DEV__: NODE_ENV === 'development',
  __TEST__: NODE_ENV === 'test',
  __PROD__: NODE_ENV === 'production'
}

export const paths = (() => {
  const base = (...args) => path.resolve(__dirname, '../../', ...args)

  return {
    base,
    src: base.bind(null, 'src'),
    dist: base.bind(null, 'dist'),
    server: base.bind(null, 'server'),
    test: base.bind(null, 'test')
  }
})()

export const pkg = require(paths.base('package.json'))

export const alias = {
  vue: 'vue/dist/vue.common'
}

export const vendors = [
  'vue',
  'vue-router',
  'vuex'
]

export default {
  serverHost: 'local.1stg.me',
  serverPort: 3000,
  devTool: 'source-map',
  publicPath: '',
  hashType: 'hash',
  minimize: false,
  browsers: ['> 1% in CN'],
  quiet: false,
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  },
  globals
}
