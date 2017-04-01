const webpack = require('webpack');
const path = require('path');

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

  // When hot reloading is used, this file by default only exists in a memory file system.
  // We therefore fetch the file manually and send it to the user when
  // running in the development environment.
  app.use('*', (req, res, next) => {
    const file = path.join(compiler.outputPath, 'index.html');

    compiler.outputFileSystem.readFile(file, (err, result) => {
      // If the server receives any requests before Webpack finishes running,
      // an error will occur.
      if (err) {
        return next(err);
      }

      res.set('Content-Type', 'text/html');
      res.send(result);
      res.end();
    });
  });
};

module.exports = addWebpackMiddlewares;
