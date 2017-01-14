const logger = require('../logging');

const root = (req, res) => {
  res.sendFile(`${__dirname}/index.html`, (err) => {
    if (err) {
      logger.error('respond with file failed', err);
      res.status(err.status).end();
    }
  });
};

module.exports = root;
