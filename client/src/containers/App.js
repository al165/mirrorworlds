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

    socket = io.connect();
    //socket = io.connect('https://mirrorworlds.io', {secure: true});
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
