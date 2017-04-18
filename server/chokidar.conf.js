const chokidar = require('chokidar');
const logger = require('./logging');

const watcher = chokidar.watch('./server', {
  ignored: /(^|[\/\\])\../, // eslint-disable-line no-useless-escape
  persistent: true,
});

watcher.on('ready', () => {
  watcher.on('all', () => {
    logger.debug('Clearing /server/ module cache');
    Object.keys(require.cache).forEach((id) => {
      if (/[\/\\]server[\/\\]/.test(id)) { // eslint-disable-line no-useless-escape
        delete require.cache[id];
      }
    });
  });
});

module.exports = watcher;
