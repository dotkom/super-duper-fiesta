const router = require('express').Router();

const issues = require('./issues');
const root = require('./root');

router.get('/', root);
router.get('/issues', issues);

module.exports = router;
