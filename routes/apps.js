var express = require('express');
var router = express.Router();

/* GET an application. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

/* POST an application. */
router.post('/', function(req, res) {
  res.send('respond with a resource');
});

module.exports = router;
