import React, { Component } from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
//import { AnimatedRoute } from 'react-router-transition';

import io from 'socket.io-client';

import Home from '../components/home';
import HowTo from '../components/howto';
import Lobby from '../containers/lobby';
import Game from '../containers/game';
import CameraTest from '../containers/cameraTest';

var socket;

class App extends Component {

  constructor(props){
    super(props);

    socket = io.connect('https://mirrorworlds.io');
    //    create unique user ID and register with server...
    socket.on('user_id', (newID) => {
        let sessionData = JSON.parse(window.sessionStorage.getItem('mw_user_data'));
        if(!sessionData || !sessionData.userID){
          sessionData = {userID: newID};
          this.setState({userID: newID});
          window.sessionStorage.setItem('mw_user_data', JSON.stringify(sessionData));
        } else {
          // already have an ID, let server know it...
          socket.emit('user_id', sessionData.userID);
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
            <Route path="/howto" component={HowTo} />
            <Route path="/cameraTest" component={CameraTest}/>
            <Route path="/lobby"
              render={(props) => <Lobby {...props} socket={socket} />}/>
            <Route path="/game/:id"
              render={(props) => <Game {...props} socket={socket} />}/>
          </Switch>
        </BrowserRouter>
    )
            //<Route component={Home} />
  }
}

export default App;
