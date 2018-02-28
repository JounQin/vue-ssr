import ExtractTextPlugin from 'extract-text-webpack-plugin'
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import webpack from 'webpack'

import { __DEV__, NODE_ENV, publicPath, resolve } from './config'

const minimize = !__DEV__
const sourceMap = __DEV__

const STYLUS_LOADERS = ExtractTextPlugin.extract({
  use: [
    {
      loader: 'css-loader',
      options: {
        minimize: minimize && {
          discardComments: {
            removeAll: true,
          },
        },
        sourceMap,
      },
    },
    {
      loader: 'postcss-loader',
      options: { minimize, sourceMap },
    },
    {
      loader: 'stylus-loader',
      options: { minimize, sourceMap },
    },
  ],
  fallback: 'vue-style-loader',
})

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
        '@babel/stage-0',
      ],
      plugins: ['transform-vue-jsx'],
    },
  },
})

export const vueLoader = isServer => ({
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
    cssModules: {
      camelCase: true,
      localIdentName: __DEV__
        ? '[name]__[local]___[hash:base64:5]'
        : '[hash:base64]',
    },
    loaders: {
      js: babelLoader(isServer),
      styl: STYLUS_LOADERS,
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
    filename: `[name].[${__DEV__ ? 'hash' : 'chunkhash'}].js`,
  },
  devtool: __DEV__ ? 'cheap-module-eval-source-map' : false,
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: STYLUS_LOADERS,
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
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize,
            },
          },
          'apply-loader',
          'pug-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      ...Object.entries(process.env).reduce((result, [key, value]) => {
        if (key !== 'VUE_ENV') {
          result[`process.env.${key}`] = JSON.stringify(value)
        }
        return result
      }, {}),
      __DEV__,
      API_PREFIX: JSON.stringify('/api'),
      NON_INDEX_REGEX: /^(?!.*[/\\](index)\.ts).*\.(ts|vue)$/.toString(),
      I18N_REGEX: /([\w-]*[\w]+)\.i18n\.json$/.toString(),
    }),
    new webpack.LoaderOptionsPlugin({
      minimize,
      stylus: {
        default: {
          import: resolve('src/styles/_variables.styl'),
          paths: resolve('node_modules/bootstrap-styl'),
        },
      },
    }),
    new ExtractTextPlugin({
      filename: 'app.[chunkhash].css',
      disable: __DEV__,
    }),
    ...(__DEV__
      ? [
          new webpack.NamedChunksPlugin(),
          new webpack.NamedModulesPlugin(),
          new FriendlyErrorsPlugin(),
        ]
      : [new webpack.optimize.ModuleConcatenationPlugin()]),
  ],
}
