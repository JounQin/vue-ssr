import ExtractTextPlugin from 'extract-text-webpack-plugin'

import config, {globals} from '../config'

const {devTool, minimize, browsers} = config

const sourceMap = !!devTool

const loaderMap = {
  css: 'css-loader',
  less: 'less-loader',
  sass: 'sass-loader?indentedSyntax',
  scss: 'sass-loader',
  styl: 'stylus-loader',
  stylus: 'stylus-loader'
}

export const nodeModules = /\bnode_modules\b/

const cssMinimize = minimize && {
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

export const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap,
    minimize,
    ...cssMinimize
  }
}

export const localIdentName = globals.__DEV__ ? '[name]__[local]___[hash:base64:5]' : '[hash:base64]'

export const cssModuleLoader = {
  ...cssLoader,
  options: {
    ...cssLoader.options,
    modules: true,
    camelCase: true,
    importLoaders: 2,
    localIdentName
  }
}

export const generateLoaders = (css, loader, {vue, extract} = {}) => {
  const sourceLoaders = loader ? [css, {
    loader,
    options: {
      sourceMap
    }
  }] : [css]

  const fallbackLoader = vue ? 'vue-style-loader' : 'style-loader'

  return extract ? (extract.extract ? extract : ExtractTextPlugin).extract({
    fallbackLoader,
    loader: sourceLoaders
  }) : [fallbackLoader, ...sourceLoaders]
}

const normalizeExclude = (exclude = []) => Array.isArray(exclude) ? exclude : [exclude]

export const commonLoaders = ({exclude} = {}) => {
  const loaders = []

  exclude = normalizeExclude(exclude)

  for (const [key, value] of Object.entries(loaderMap)) {
    if (exclude.includes(key)) continue

    const regExp = new RegExp(`\\.${key}$`)

    loaders.push({
      test: regExp,
      use: generateLoaders(cssLoader, value),
      include: nodeModules
    }, {
      test: regExp,
      use: generateLoaders(cssModuleLoader, value),
      exclude: nodeModules
    })
  }

  return loaders
}

export const vueLoaders = () => {
  const loaders = {}
  for (const [key, value] of Object.entries(loaderMap)) {
    loaders[key] = generateLoaders(cssLoader, key !== 'css' && value, {vue: true})
  }
  return loaders
}
