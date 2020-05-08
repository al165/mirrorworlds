var express = require('express');
var router = express.Router();
const path = require('path');


/* GET home page. */
router.get('/*', function(req, res, next) {
  console.log('[index]', '/');
  res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  //res.sendFile(path.join(__dirname, '../client/dist/main.js'))
});

module.exports = router;
