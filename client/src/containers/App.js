import React, { Component } from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import { AnimatedRoute } from 'react-router-transition';

import Home from '../components/home';
import About from '../components/about';
import Lobby from '../containers/lobby';
import CameraScreen from '../containers/cameraScreen';

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

//        <BrowserRouter forceRefresh={!supportsHistory}>
//            <Route exact path="/" component={Home} />
//            <AnimatedRoute path="/about" component={About}
//              atEnter={{offset: -100}}
//              atLeave={{offset: -100}}
//              atActive={{offset: 0}}
//              mapStyles={(styles) => ({
//                transform: `translateX(${styles.offset}%)`
//            })}/>
//            <AnimatedRoute path="/lobby" component={Lobby}
//              atEnter={{offset: 100}}
//              atLeave={{offset: 100}}
//              atActive={{offset: 0}}
//              mapStyles={(styles) => ({
//                transform: `translateX(${styles.offset}%)`
//            })}/>
//            <Route path="/cameraTest" component={CameraScreen}/>
//            <Route component={Home} />
//        </BrowserRouter>
export default App;
