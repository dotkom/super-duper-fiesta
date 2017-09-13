const merge = require('webpack-merge');
const config = require('./webpack.config');

module.exports = merge.smart(config, {
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
        ],
      },
    ],
  },
  devServer: {
    proxy: [
      {
        context: ['/socket.io/', '/login', '/auth', '/logout'],
        target: 'http://localhost:3000',
      },
    ],
    historyApiFallback: {
      index: '/',
    },
  },
});
