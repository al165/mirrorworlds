import React, { Component } from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
//import { AnimatedRoute } from 'react-router-transition';

import io from 'socket.io-client';

import Home from '../components/home';
import About from '../components/about';
import Lobby from '../containers/lobby';
import Game from '../containers/game';
import CameraScreen from '../containers/cameraScreen';

var socket;

class App extends Component {

  constructor(props){
    super(props);

    socket = io.connect('https://mirrorworlds.io');
    //    create unique user ID and register with server...
    socket.on('user_id', (newID) => {
        console.log('user_id', newID);
        let sessionData = JSON.parse(window.sessionStorage.getItem('mw_user_data'));
        if(!sessionData || !sessionData.userID){
          sessionData = {userID: newID};
          this.setState({userID: newID});
          console.log('recieved userID:', newID)
          window.sessionStorage.setItem('mw_user_data', JSON.stringify(sessionData));
        } else {
          // already have an ID, let server know it...
          socket.emit('user_id', sessionData.userID);
          console.log('found userID:', sessionData.userID);
        }
    });

    socket.open();
  }

  render() {
    const supportsHistory = 'pushState' in window.history;
    return (
        <BrowserRouter forceRefresh={!supportsHistory}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/cameraTest" component={CameraScreen}/>
            <Route path="/lobby"
              render={(props) => <Lobby {...props} socket={socket} />}/>
            <Route path="/game/:id"
              render={(props) => <Game {...props} socket={socket} />}/>
            <Route component={Home} />
          </Switch>
        </BrowserRouter>
    )
  }
}

export default App;
