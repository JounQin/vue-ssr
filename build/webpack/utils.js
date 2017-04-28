import ExtractTextPlugin from 'extract-text-webpack-plugin'
import _debug from 'debug'
import {argv} from 'yargs'

import config, {globals} from '../config'

const {devTool, browsers, minimize} = config

const {__TEST__, __PROD__} = globals

const sourceMap = !!devTool

// generate loader string to be used with extract text plugin
export const generateLoaders = (loader, loaders, options = {}) => {
  const sourceLoaders = (loader ? [...loaders, loader] : loaders).map((loader, index) => {
    const hyphen = /\?/.test(loader) ? '&' : '?'
    return loader + (sourceMap && index ? hyphen + 'sourceMap' : '')
  }).join('!')

  const styleLoader = 'vue-style-loader'

  let extract = options.extract
  return extract ? (extract.extract ? extract : ExtractTextPlugin).extract({
    fallback: styleLoader,
    use: sourceLoaders
  }) : [styleLoader, sourceLoaders].join('!')
}

const cssMinimize = (__TEST__ || __PROD__) && {
  autoprefixer: {
    add: true,
    remove: true,
    browsers
  },
  discardComments: {
    removeAll: true
  },
  safe: true,
  sourcemap: sourceMap
}

const cssOptions = {
  minimize,
  sourceMap,
  ...cssMinimize
}

export const baseLoaders = ['css-loader?' + JSON.stringify(cssOptions)]
export const localIdentName = __PROD__ ? '[hash:base64]' : '[name]__[local]___[hash:base64:5]'

const cssModuleOptions = {
  modules: true,
  camelCase: true,
  importLoaders: 2,
  localIdentName
}

export const cssModuleLoaders = ['css-loader?' + JSON.stringify(Object.assign({}, cssOptions, cssModuleOptions))]

const loaderMap = {
  css: '',
  less: 'less-loader',
  sass: 'sass-loader?indentedSyntax',
  scss: 'sass-loader',
  styl: 'stylus-loader',
  stylus: 'stylus-loader'
}

const debug = argv.debug
const debugPrefix = 'hi:webpack:'
export const nodeModules = /\bnode_modules\b/

const normalizeExclude = (exclude = []) => Array.isArray(exclude) ? exclude : [exclude]

export const commonCssLoaders = (options = {}) => {
  options.vue = false

  const exclude = normalizeExclude(options.exclude)
  const loader = []

  for (const [key, value] of Object.entries(loaderMap)) {
    if (exclude.includes(key)) continue

    const regExp = new RegExp(`\\.${key}$`)

    loader.push({
      test: regExp,
      loader: generateLoaders(value, baseLoaders, options),
      include: nodeModules
    }, {
      test: regExp,
      loader: generateLoaders(value, cssModuleLoaders, options),
      exclude: nodeModules
    })
  }

  debug && _debug(`${debugPrefix}commonCssLoaders`)(loader)

  return loader
}

export const vueCssLoaders = (options = {}) => {
  options.vue = true

  const exclude = normalizeExclude(options.exclude)
  const loader = {}

  for (const [key, value] of Object.entries(loaderMap)) {
    if (exclude.includes(key)) continue
    loader[key] = generateLoaders(value, baseLoaders, options)
  }

  debug && _debug(`${debugPrefix}vueCssLoaders`)(loader)

  return loader
}
