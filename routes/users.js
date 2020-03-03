var express = require('express');
var router = express.Router();
var r = require('rethinkdb')

// RethinkDB connection:
var connection;

r.connect({host: 'localhost', port: 28015}, function(err, conn) {
  if (err) throw err;
  connection = conn;
});

/* initialise the database */
router.get('/init', function(req, res, next) {
  r.db('mirrorworlds').table('users').insert([
    {
      id: 1,
      username: "arran"
    }, {
      id: 2,
      username: "roos"
    }
  ], {conflict: 'replace'}).run(connection, function(err, reuslt) {
    if (err) throw err;
    console.log('Users added');
    res.sendStatus(200);
  })
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  r.db('mirrorworlds').table('users').run(connection, function(err, cursor) {
    if (err) throw err;
    cursor.toArray(function(err, results) {
      if (err) throw err;
      res.json(results);
    })
  })
})

module.exports = router;
