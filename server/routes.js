const router = require('express').Router();
const logger = require('./logging')

router.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`, (err) => {
    if (err) {
      logger.error('respond with file failed', err);
      res.status(err.status).end();
    }
  });
});

/* Get the current active meeting */
router.get('/genfors', (req, res) => {
  // var meeting = getActiveMeeting()
  res.json({ title: 'Generalforsamlingen 2017', date: new Date(1484395200000) });
});

/* Used to fetch historical questions and their results */
router.get('/questions', (req, res) => {
  res.json([{ title: 'temporary question title' }]);
});


module.exports = router;
