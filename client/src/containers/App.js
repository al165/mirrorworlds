import React, { Component } from 'react';
//import './App.css';
//import Home from '../components/home';
import CameraScreen from '../containers/cameraScreen2';

class App extends Component {
  state = {users: []}

  //componentDidMount() {
  //  fetch('/api/users')
  //    .then(res => res.json())
  //    .then(users => this.setState({ users }));
  //}

  render() {
    return (
        <div style={{width: "100%", height: "100%"}}>
        <CameraScreen />
        </div>
    )


    //return (
    //  <div className="App">
    //    <h1>Users</h1>
    //    {this.state.users.map(user =>
    //      <div key={user.id}>{user.username}</div>
    //    )}
    //  </div>
    //);
  }
}

export default App;
