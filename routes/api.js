var express = require('express');
var router = express.Router();

var r = require('rethinkdb');
var connection;


function createId() {
  // Creates a five letter game id (not guaranteed to be unique...)
  var result = '';
  var characters = 'abcdefghijklmnopqrstuvxyz';
  var length = characters.length;
  for(var i = 0; i < 5; i++){
    result += characters.charAt(Math.floor(Math.random() * length))
  }
  return result;
}


// connect to the database:
r.connect({host: 'localhost', port: 28015}, function(err, conn) {
  if(err) throw err;

  connection = conn;
  console.log('[api]', 'connected to db');

  //TODO: connect Socket.io, reset game timers etc...
});


router.get('/allgames', function(req, res, next) {
  // Get list of all active games...
  console.log('[api]', '/allgames');
  r.db('mirrorworlds').table('active_games').run(connection)
    .then(function(cursor){
      return cursor.toArray();
    })
    .then(function(results){
      res.json(results);
    })
    .catch(function(err){
      console.log(err);
      res.sendStatus(500);
    })
});

router.post('/creategame', function(req, res) {
  // User created a new game.

  console.log('[api]', '/creategame', req.body.username);

  const username = req.body.username;
  const newID = createId();

  r.db('mirrorworlds').table('active_games').insert([
    {
      id: newID,
      owner: username,
      players: [
        username
      ]
    }
  ]).run(connection)
    .then(function(result){
      if(result.errors > 0){
        console.log('error creating table');
        res.json({ status: "error" });
      } else {
        res.json({ status: "ok", id: newID });
      }
    }).catch(function(err){
      console.log('[api]', err);
      res.sendStatus(500);
    });

});

router.get('/*', function(req, res, next) {
  // Handle incorrect api requests...
  res.status(404).send('<h3>Api GET request not handled.</h3><a href="https://mirrorworlds.io">HOME</a>');
})

router.post('/*', function(req, res, next) {
  // Handle incorrect api requests...
  res.status(404).send('<h3>Api POST request not handled.</h3><a href="https://mirrorworlds.io">HOME</a>');
})

module.exports = router;
