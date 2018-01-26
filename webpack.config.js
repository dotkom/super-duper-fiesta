const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const entries = [];

// Only add hot loader patch if not in production.
// Cannot use webpack merge atm.
if (process.env.NODE_ENV !== 'production') {
  entries.push('react-hot-loader/patch');
}
entries.push('./client/src/index.js');

module.exports = {
  entry: entries,
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  resolve: {
    alias: {
      common: path.resolve(__dirname, 'common'),
    },
    modules: [
      // Allows importing directly from the src folder. e.g. 'features/user/reducer'
      path.resolve('./client/src'),
      'node_modules',
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?[a-z0-9=&.]+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin(),
    new HtmlWebpackPlugin({
      template: 'client/index.html',
    }),
    new FaviconsWebpackPlugin('./client/favicon.png'),
    new webpack.EnvironmentPlugin({
      SDF_SENTRY_DSN_BACKEND: '',
      SDF_SENTRY_DSN_FRONTEND: '',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => (
        module.context && module.context.indexOf('node_modules') !== -1
      ),
    }),
  ],
};
