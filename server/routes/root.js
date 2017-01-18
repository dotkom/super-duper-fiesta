const logger = require('../logging');
const path = require('path');

const root = (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../index.html'), (err) => {
    if (err) {
      logger.error('respond with file failed', err);
      res.status(err.status).end();
    }
  });
};

module.exports = root;
