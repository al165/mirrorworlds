var express = require('express');
var router = express.Router();

const debug = require('debug');
const log = debug('mirrorworlds:api');

//var r = require('rethinkdb');
//var connection;

var jsonDB = require('node-json-db');
var config = require('node-json-db/dist/lib/JsonDBConfig');
//import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

var db = new jsonDB.JsonDB(new config.Config("mirrorworlds", true, true, '/'));
var gameTimers = {};

function createId() {
  // Creates a 6 letter id (for players and games)
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz';
  var length = characters.length;
  for(var i = 0; i < 6; i++){
    result += characters.charAt(Math.floor(Math.random() * length))
  }
  return result;
}


// connect to the database:
//r.connect({host: 'localhost', port: 28015}, function(err, conn) {
//  if(err) throw err;
//
//  connection = conn;
//  console.log('[api]', 'connected to db!');
//  log('connected to db');
//
//  //TODO: connect Socket.io, reset game timers etc...
//
//});


var returnRouter = function(io){

console.log(' == returnRouter');

io.on('connection', (socket) => {
  console.log('[socket.io]', 'user connected');

  socket.on('disconnect', (reason) => {
    console.log('[socket.io]', 'user disconnected becauese ', reason);
  })
})

router.get('/allgames', function(req, res, next) {
  // Get list of all active games...
  var data = db.getData('/');

  // collect metadata
  var metadata = [];
  for (var k in data) {
    if(data.hasOwnProperty(k)){
      var game = data[k];
      metadata.push({
        gameID: k,
        owner: game.owner,
        players: Object.keys(game.players).length
      });
    }
  }

  res.json(metadata);
  //r.db('mirrorworlds').table('active_games').run(connection)
  //  .then(function(cursor){
  //    return cursor.toArray();
  //  })
  //  .then(function(results){
  //    res.json(results);
  //  })
  //  .catch(function(err){
  //    console.log(err);
  //    res.sendStatus(500);
  //  })
});

/*
 * Example game entry:
 *
 {
   id: "chthlq",
   state: "seek",
   rounds: 3,
   players: [{
       id: "abjasd":
       username: "arran",
       score: 123,
       online: true
     },
     {
       id: "qwerqq",
       username: "roos",
       score: 183,
       online: true
     }
 ],
   submissions: {
     "abjasd": {
       "abjasd": ajsdfljas;ldjf;lajdf,
       "qwerqq": aksdjhbinaeronfonvkn
     },
     "qwerqq": {
       "abjasd": null,
       "qwerqq": cnnuunadjnkjansdvjnn
     }
   }
 }
 */

router.post('/gamedata', function(req, res, next) {
  console.log('[api]', '/gamedata', req.body.gameID);

  const gameID = req.body.gameID;

  try {
    var data = db.getData('/'+gameID);
    if(data){
      res.json(data)
    } else {
      res.sendStatus(500);
    }
  } catch (err) {
    res.sendStatus(500);
  }

});


router.post('/creategame', function(req, res) {
  // User created a new game.
  console.log('[api]', '/creategame', req.body.username);
  log('/creategame');

  const username = req.body.username;
  const newID = createId();

  try {
    db.push('/'+newID, {
      owner: username,
      rounds: 0,
      state: "game_wait",
      players: {},
      submissions: {}
    });

    io.sockets.emit('game_list_updated');

    if(joinGame(newID, username)){
      res.json({gameID: newID});
    } else {
      res.sendStatus(500);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }

  //r.db('mirrorworlds').table('active_games').insert([
  //  {
  //    id: newID,
  //    owner: username,
  //    rounds: 0,
  //    state: "game_wait",
  //    players: {},
  //    submissions: {},
  //  }
  //]).run(conneczaktion)
  //  .then(function(result){
  //    if(result.errors > 0){
  //      log('error creating "active_games" table');
  //      res.sendStatus(500);
  //    } else {
  //      joinGame(newID, username)
  //        .then(function(result){
  //          console.log('sucess joining');
  //          res.json({gameID: newID});
  //        })
  //        .catch(function(err){
  //          console.log('failure joining');
  //          res.sendStatus(500);
  //        })
  //    }
  //  }).catch(function(err){
  //    log(err);
  //    res.sendStatus(500);
  //  });
});


router.post('/joingame', function(req, res) {
  console.log('[api]', '/joingame', req.body);


  const username = req.body.username;
  const gameID = req.body.gameID;

  if(joinGame(gameID, username)){
    res.json({gameID: gameID});
  } else {
    res.sendStatus(500);
  }

  //joinGame(newID, username)
  //  .then(function(result){
  //    console.log('sucess joining');
  //    res.json({gameID: newID});
  //  })
  //  .catch(function(err){
  //    console.log('failure joining');
  //    res.sendStatus(500);
  //  })
})

function joinGame(gameID, username) {
  const player = {
    username: username,
    score: 0,
    online: true
  };

  playerID = createId();

  console.log('[api]', 'joinGame', gameID, username, playerID);

  try {
    db.push('/'+gameID+'/players/'+playerID, player);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }

  //return new Promise((resolve, reject) => {
  //  r.db('mirrorworlds').table('active_games').get(gameID)('players')
  //    .run(connection)
  //    .then(function(result){
  //      result[playerID] = player;

  //      r.db('mirrorworlds').table('active_games').get(gameID).update({players: result})
  //        .run(connection)
  //        .then(function(result){
  //          resolve('success');
  //        })
  //        .catch(function(err){
  //          log('error updating players', err);
  //          reject('failure');
  //        });
  //    }).catch(function(err){
  //      log('error joining game:', err)
  //      reject('failure');
  //    })
  //})
}

function deleteGame(gameID){
  console.log('[api]', 'deleteGame', gameID);
  try {
    db.delete('/'+gameID);
  } catch (err) {
    console.log(err);
  }
}

router.get('/*', function(req, res, next) {
  // Handle incorrect api requests...
  res.status(404).send('<h3>Api GET request not handled.</h3><a href="https://mirrorworlds.io">HOME</a>');
});

router.post('/*', function(req, res, next) {
  // Handle incorrect api requests...
  console.log('404 POST not handled');
  res.status(404).send('<h3>Api POST request not handled.</h3><a href="https://mirrorworlds.io">HOME</a>');
});


  return router;
}

module.exports = returnRouter;
