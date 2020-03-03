var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'client/build/index.html'))
  //res.render('index', { title: 'Express' });
});

module.exports = router;
