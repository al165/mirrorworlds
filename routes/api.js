var express = require('express');
var router = express.Router();
const debug = require('debug');
const log = debug('mirrorworlds:api');

var jsonDB = require('node-json-db');
var config = require('node-json-db/dist/lib/JsonDBConfig');

var db = new jsonDB.JsonDB(new config.Config("mirrorworlds", true, true, '/'));

var gameKillTimers = {};
var gameStateTimers = {};

const ABANDONED_GAME_TIMEOUT = 5*60*1000;
const CAPTURE_TIME = 0.5*60*1000;
const SEEK_TIME = 1.5*60*1000;
const JUDGE_TIME = 0.5*60*1000;
const POST_GAME_TIME = 0.5*60*1000;

const GAME_TIMES = {
  'capture': CAPTURE_TIME,
  'seek': SEEK_TIME,
  'judge': JUDGE_TIME,
  'post_game': POST_GAME_TIME
}

const NEXT_STATE = {
  'capture': 'post_game',    // assume no one plays until they do...
  'seek': 'judge',
  'judge': 'post_game',
  'post_game': 'capture'
}

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

var returnRouter = function(io){
  console.log(' == returnRouter');

  io.on('connection', (socket) => {
    console.log('[socket.io]', 'user connected');
    var userID = createId();

    socket.emit('user_id', userID);

    socket.on('user_id', (newID) => {
      console.log('[socket.io]', 'user_id', newID);
      userID = newID;
    });

    socket.on('reconnect', (attempt) => {
      console.log(userID, 'reconnect', attempt)
    })

    socket.on('disconnect', (reason) => {
      console.log('[socket.io]', 'user', userID, 'disconnected becauese ', reason);
    });

    socket.on('joined_game', (gameID) => {
      console.log('[socket.io]', 'player ' + userID + ' joined game', gameID);
      socket.join(gameID);
    });

    socket.on('game_leave', (gameID) => {
      console.log('[socket.io]', 'player ' + userID + ' has left game ' + gameID);
      socket.leave(gameID);
    })
  });


  router.get('/allgames', function(req, res, next) {
    // Get list of all active games...
    try {
      var data = db.getData('/');
    } catch(err) {
      console.log('[ERROR]', '/allgames', err);
      res.sendStatus(500);
      return 1;
    }

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
  });

  /********************
  * Example game entry:
  *********************

  id: "chthlq" {
    owner: "arnlyn",
    rounds: 3,
    state: "seek",
    nextstate: 1589412109101,
    players: {"abjasd":{
        username: "arran",
        score: 123,
        earned: 12
      },
      "qwerqq": {
        username: "roos",
        score: 183,
        earned: 53
      }
  },
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
  ********************/

  router.post('/gamedata', function(req, res, next) {
    // only returns data that pertains to userID to save bandwidth
    console.log('[api]', '/gamedata', 'gameID: ', req.body.gameID, ' token: ', req.body.token,
                ' userID: ', req.body.userID);
    const { gameID, userID } = req.body;

    try {
      var data = db.getData('/'+gameID);

      if(data){
        let packet = {
            owner: data.owner,
            rounds: data.rounds,
            state: data.state,
            nextstate: data.nextstate,
            players: data.players
          };

        let submissions = {};

        // only need the diagonals in 'seek', or columns in judge
        if (data.state == 'seek'){
          for (var k of Object.keys(data.submissions)){
            // the diagonal...
            submissions[k] = {[k]: data.submissions[k][k]}
          }

        } else if (data.state == 'judge' && userID) {
          // columns...
          for (var k of Object.keys(data.submissions)){
            console.log('[api]', '-- added submission from', k);
            submissions[k] = {[userID]: data.submissions[k][userID]}
          }
        }

        packet.submissions = submissions;

        res.json(packet);

      } else {
        console.log('[ERROR]', '/gamedata', 'no data returned');
        res.sendStatus(500);
      }
    } catch (err) {
      console.log('[ERROR]', '/gamedata', gameID);
      console.log(err);
      res.sendStatus(500);
    }
  });

  router.post('/creategame', function(req, res) {
    // User created a new game.
    console.log('[api]', '/creategame', req.body.username);

    const username = req.body.username;
    const userID = req.body.userID;
    const gameID = createId();

    try {
      db.push('/'+gameID, {
        owner: username,
        rounds: 0,
        state: "game_wait",
        nextstate: Date.now(),
        players: {},
        submissions: {}
      });

      updateKillTimer(gameID);

      if(joinGame(gameID, username, userID)){
        io.sockets.emit('game_list_updated');
        // shouldjoin informs player still needs to subscribe to game updates
        res.json({gameID: gameID, shouldjoin: true});
      } else {
        console.log('[ERROR]', '/creategame', 'joinGame returned FALSE');
        res.sendStatus(500);
        deleteGame(gameID);
      }

    } catch (err) {
      console.log('[ERROR]', '/creategame', err);
      deleteGame(gameID);
      res.sendStatus(500);
    }
  });


  router.post('/joingame', function(req, res) {
    console.log('[api]', '/joingame', req.body);

    const username = req.body.username;
    const gameID = req.body.gameID;
    const userID = req.body.userID;

    if(joinGame(gameID, username, userID)){
      res.json({gameID: gameID});
      updateKillTimer(gameID);
    } else {
      console.log('[ERROR]', '/joingame', 'joingame returned false');
      res.sendStatus(500);
    }

  })

  function updateKillTimer(gameID) {
    console.log('[api]', 'updateKillTimer', gameID)
    if(gameID != 'test'){
      clearTimeout(gameKillTimers[gameID]);
      gameKillTimers[gameID] = setTimeout(function(){
        deleteGame(gameID);
      }, ABANDONED_GAME_TIMEOUT);
    }
  }

  function joinGame(gameID, username, userID) {
    const player = {
      username: username,
      score: 0,
      earned: 0,
    };

    console.log('[api]', 'joinGame', gameID, username, userID);

    try {
      db.push('/'+gameID+'/players/'+userID, player);
      // successfully joined
      //console.log(' -- successful')
      io.sockets.to(gameID).emit('game_updated', gameID);
      return true;
    } catch (err) {
      console.log(' -- ', err);
      return false;
    }
  }

  router.post('/startgame', function(req, res) {
    console.log('[api]', '/startgame', req.body);

    const username = req.body.username;
    const gameID = req.body.gameID;

    // check if username is owner of gameID:
    try{
      var data = db.getData('/'+gameID);
    } catch (err) {
      console.log('[ERROR]', '/startgame', err);
      res.sendStatus(500);
      return 1;
    }

    if(data.owner != username){
      console.log('[ERROR]', '/startgame', 'wrong owner, not starting game.');
      res.sendStatus(500);
      return 1;
    }

    // start the game!
    try {
      setGameState(gameID, 'capture');
      updateKillTimer(gameID);
      res.sendStatus(200);
    } catch (err) {
      console.log('[ERROR]', '/startgame', err);
      res.sendStatus(500);
      return 1;
    }
  });

  function setGameState(gameID, state){
    // sets game gameID to state
    console.log('[api]', 'setGameState', gameID, state);
    try {
      if (state == 'capture'){
        finishRound(gameID);
      }
      db.push('/'+gameID, {
        state: state,
        nextstate: Date.now() + GAME_TIMES[state],
      }, false);

      io.sockets.to(gameID).emit('game_updated', gameID);

      var next_state = NEXT_STATE[state];
      console.log('[api]', 'setGameState', next_state);
      gameStateTimers[gameID] = setTimeout(()=>{
        setGameState(gameID, next_state);
      }, GAME_TIMES[state])

    } catch (err) {
      console.log('[api]', 'setGameState', err);
    }
  }

  function finishRound(gameID){
    console.log('[api]', 'finishRound', gameID);
    try {
      let gameData = db.getData('/'+gameID);

      // add up scores
      let players = gameData.players;
      for (let userID of Object.keys(players)) {
        const new_score = players[userID].earned + players[userID].score;
        db.push('/'+gameID+'/players/'+userID, {
          score: new_score,
          earned: 0
        }, false);
      }

      // increment round counter, clear submissions
      db.push('/'+gameID+'/round', gameData.round + 1);
      db.push('/'+gameID+'/submissions', {});
    } catch (err) {
      console.log('[ERROR]', 'finishedRound', err);
    }
  }

  router.post('/submitobject', function(req, res){
    console.log('[api]', '/submitobject');
    const { userID,
            targetID,
            gameID,
            image,
            time } = req.body;

    try{
      // check legit...
      // should also check image isn't too big?

      const gameData = db.getData('/'+gameID);
      if(!gameData){
        console.log('[api]', 'game does not exist');
        res.sendStatus(400);
      } else if(gameData.state != 'seek' && gameData.state != 'capture'){
        console.log('[api]', 'photo submitted to wrong state');
        res.sendStatus(400);
      } else if (gameData.state != 'capture' && userID == targetID){
        console.log('[api]', 'photo submitted to self when not in capture mode');
        res.sendStatus(400);
      } else if (gameData.submissions.userID && gameData.submissions.userID.targetID){
        console.log('[api]', 'photo already submitted');
        res.sendStatus(400);
      } else {

        const submission = {
          photo: image,
          judgement: null,
          time: time
        }

        db.push('/'+gameID+'/submissions/'+userID+'/'+targetID, submission);

        // restart game state timer to send to seek screen...
        if(gameData.state == 'capture'){
          const time_left = gameData.nextstate - Date.now();
          console.log(time_left);
          clearTimeout(gameStateTimers[gameID]);
          gameStateTimers[gameID] = setTimeout(()=>{
            setGameState(gameID, 'seek');
          }, time_left)
        }

        updateKillTimer(gameID);
        res.sendStatus(200);
      }

    } catch (err) {
      console.log('[ERROR]', '/submitobject', err);
      res.sendStatus(500);
    }
  });


  router.post('/submitjudgement', function(req, res){
    console.log('[api]', '/submitjudgement');
    const { gameID,
            userID,
            targetID,
            judgement } = req.body;

    try{
      const gameData = db.getData('/'+gameID);
      if(!gameData){
        console.log('[api]', 'game does not exist', gameID);
        res.sendStatus(400);
      } else if(gameData.state != 'judge'){
        console.log('[api]', 'judgement sent to wrong state');
        res.sendStatus(400);
      } else if(!gameData.submissions[targetID] && !gameData.submissions[targetID][userID]){
        console.log('[api]', 'targetID or userID note avaliable');
        res.sendStatus(400);
      } else if(gameData.submissions[targetID][userID].judgement){
        console.log('[api]', 'photo already judged');
        res.sendStatus(400);
      } else {
        db.push('/'+gameID+'/submissions/'+targetID+'/'+userID+'/judgement', judgement);
        if(judgement){
          // calculate the score
          // SEEKER
          let target_score = 1 + Math.ceil((SEEK_TIME - gameData.submissions[targetID][userID].time) / 2000)
          target_score = Math.max(1, target_score);
          const seeker_earned = gameData.players[targetID].earned + target_score;
          db.push('/'+gameID+'/players/'+targetID+'/earned', seeker_earned);

          // SUBMITTER gets more points the longer it took to find...
          let user_score = Math.ceil(gameData.submissions[targetID][userID].time / 2000);
          user_score = Math.max(0, user_score);
          const submitter_earned = gameData.players[userID].earned + user_score;
          db.push('/'+gameID+'/players/'+userID+'/earned', submitter_earned);
        }

        updateKillTimer(gameID);
        res.sendStatus(200);
      }
    } catch(err) {
      console.log('[api]', '/submitjudgement', err);
      res.sendStatus(400);
    }
  });


  function deleteGame(gameID){
    console.log('[api]', 'deleteGame', gameID);
    try {
      if(gameStateTimers[gameID]){
        clearTimeout(gameStateTimers[gameID]);
        gameStateTimers[gameID] = null;
      }
      clearTimeout(gameKillTimers[gameID]);

      io.sockets.to(gameID).emit('game_deleted', gameID);
      // remove everyone from room....
      io.of('/').in(gameID).clients(function(err, clients){
        clients.forEach((s)=>{
          io.sockets.sockets[s].leave(gameID);
        });

      io.sockets.emit('game_list_updated');
      db.delete('/'+gameID);
      });
    } catch (err) {
      console.log(' -- ', err);
    }
  }


  // reset game timers...
  let games = db.getData('/');

  for (let k of Object.keys(games)) {
    console.log(k);
    updateKillTimer(k);

    let next_state = NEXT_STATE[games[k].state];
    if(next_state){
      gameStateTimers[k] = setTimeout(()=>{
        setGameState(k, next_state);
      }, games[k].nextstate - Date.now());
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
