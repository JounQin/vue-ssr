import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import MiniCssExractPlugin from 'mini-css-extract-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import webpack from 'webpack'

import { __DEV__, NODE_ENV, hashType, publicPath, resolve } from './config'

const sourceMap = __DEV__

const stylusLoaders = ({ modules, extract } = {}) => [
  extract ? MiniCssExractPlugin.loader : 'vue-style-loader',
  {
    loader: 'css-loader',
    options: {
      sourceMap,
      modules,
      camelCase: true,
      localIdentName: __DEV__
        ? '[name]__[local]___[hash:base64:5]'
        : '[hash:base64]',
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap,
    },
  },
  {
    loader: 'stylus-loader',
    options: {
      sourceMap,
      import: resolve('src/styles/_variables.styl'),
      paths: resolve('node_modules/bootstrap-styl'),
    },
  },
]

export const babelLoader = isServer => ({
  test: /\.js$/,
  loader: 'babel-loader',
  exclude: /node_modules/,
  options: {
    cacheDirectory: true,
    ...{
      presets: [
        [
          '@babel/env',
          {
            modules: false,
            exclude: isServer && [
              'babel-plugin-transform-async-to-generator',
              'babel-plugin-transform-regenerator',
            ],
          },
        ],
      ],
      plugins: ['@babel/syntax-dynamic-import', '@vue/transform-vue-jsx'],
    },
  },
})

export default {
  mode: NODE_ENV,
  resolve: {
    alias: {
      lodash$: 'lodash-es',
    },
    modules: [resolve('src'), 'node_modules'],
    extensions: ['.vue', '.js', '.styl'],
  },
  output: {
    path: resolve('dist/static'),
    publicPath,
    filename: `[name].[${hashType}].js`,
  },
  module: {
    rules: [
      {
        test: /\.(css|styl(us)?)$/,
        oneOf: [
          {
            resourceQuery: /module/,
            use: stylusLoaders({ modules: true }),
          },
          {
            resourceQuery: /^\?vue/,
            use: stylusLoaders(),
          },
          {
            use: stylusLoaders({ extract: true }),
          },
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff2?)$/,
        loader: 'url-loader',
        options: {
          limit: 1024 * 8,
        },
      },
      {
        test: /\.pug$/,
        oneOf: [
          {
            resourceQuery: /^\?vue/,
            loader: 'pug-plain-loader',
          },
          {
            use: ['html-loader', 'pug-plain-loader'],
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__,
      API_PREFIX: JSON.stringify('/api'),
      NON_INDEX_REGEX: /^(?!.*[/\\](index)\.ts).*\.(ts|vue)$/.toString(),
      I18N_REGEX: /([\w-]*[\w]+)\.i18n\.json$/.toString(),
    }),
    new FriendlyErrorsPlugin(),
    new MiniCssExractPlugin({
      filename: `[name].[${hashType}].css`,
    }),
    new VueLoaderPlugin(),
  ],
}
