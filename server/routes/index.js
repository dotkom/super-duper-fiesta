const router = require('express').Router();

const issues = require('./issues');
const root = require('./root');

router.get('/issues', issues);

// We want to use react-router with browser history, instead of hash-history.
// Therefore we send every non-defined path to the root,
// so that react-router can handle them.
router.get('*', root);

module.exports = router;
