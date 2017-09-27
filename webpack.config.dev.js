const merge = require('webpack-merge');
const config = require('./webpack.config');

const host = process.env.SDF_HOST || 'localhost';
const port = process.env.SDF_PORT || '8080';

const backendHost = process.env.SDF_BACKEND_HOST || 'backend';
const backendPort = process.env.SDF_BACKEND_PORT || '3000';

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
    host,
    port,
    proxy: [
      {
        context: ['/socket.io/', '/login', '/auth', '/logout'],
        target: `http://${backendHost}:${backendPort}`,
      },
    ],
    historyApiFallback: {
      index: '/',
    },
  },
});
