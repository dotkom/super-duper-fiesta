const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');

module.exports = webpackMiddleware(webpack(require('../webpack.config.js')), {
  watchOptions: {
    aggregateTimeout: 300,
    poll: true,
  },

  publicPath: '/dist/',

  index: '../client/index.html',

  stats: {
    chunks: false,
    colors: true,
  },
});
