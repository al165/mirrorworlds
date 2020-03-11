import React, { Component } from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';

import Home from '../components/home';
import About from '../components/about';
import Lobby from '../components/lobby';
import CameraScreen from '../containers/cameraScreen2';

//import CameraScreen from '../containers/cameraScreen2';

class App extends Component {

  render() {
    const supportsHistory = 'pushState' in window.history;
    return (
        <BrowserRouter forceRefresh={!supportsHistory}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/lobby" component={Lobby} />
            <Route path="/cameraTest" component={CameraScreen}/>
            <Route component={Home} />
          </Switch>
        </BrowserRouter>
    )
  }
}

export default App;
