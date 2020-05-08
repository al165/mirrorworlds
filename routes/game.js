var express = require('express');
var router = express.Router();
const path = require('path');




router.get('/*', function(req, res, next) {
  // Handle incorrect api requests...
  res.sendFile(path.join(__dirname, '../client/dist/index'))
});

module.exports = router;
