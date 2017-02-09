const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.config.js');

const webpackDevOptions = {
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
};

const enableHotReloading = (config) => {
  // Enable HMR plugins
  config.plugins.push(
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin());

  // Add webpack-hot-middleware to frontend
  config.entry.unshift('webpack-hot-middleware/client');

  // Add React Hot Loader to js loader
  config.module.loaders.forEach((loader) => {
    if (loader.test.test('.js')) {
      loader.loaders.unshift('react-hot-loader');
    }
  });
};

const addWebpackMiddlewares = (app) => {
  enableHotReloading(webpackConfig);
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, webpackDevOptions));
  app.use(webpackHotMiddleware(compiler));
};

module.exports = addWebpackMiddlewares;
