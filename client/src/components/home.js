import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Div100vh from 'react-div-100vh';

import HowTo from '../components/howto';
import Popup from '../components/popup';

import logo from '../images/logo.mp4';
import styles from '../css/home.module.css';
import buttons from '../css/buttons.module.css';


class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: null
        }
    }

    render() {
        let about = (
            <Div100vh style={{height: '80rvh', display: 'flex', flexDirection: 'column'}}>
              <h3 style={{color: '#F00'}}>About MirrorWorlds</h3>
              <div style={{flex: 2, overflow: 'auto', height: '80%'}}>
                <p>
                  Mirror Worlds is developed by Roos Groothuizen and Arran Lyon in 2019-2020. The game was created during the research on Augmented Reality at the Rathenau Instituut in the Hague (The Netherlands). It focuses on frictions between digital games and the public, physical space.
                </p>
                <p>
                  Mirror Worlds does not track any data and does not store any data after a game has been played.
                  The game asks players to take pictures of elements and objects in the public space. To be able to communicate the photos with their fellow players, photos are temporarily stored in a database. The database is erased after every game.
                </p>
                <p>
                  This also means that Mirror Worlds does not have any means to control the nature and content of any picture or any username. Please play this game at your own discretion.
                </p>
                <p>
                  For any questions regarding the privacy of this game, you can reach out to <u>hello@roos.gr</u>
                </p>
              </div>
              <p><button className={buttons.red} onClick={()=>{this.setState({show: null})}}>Back</button></p>
            </Div100vh>
        );

        let howto = (
            <Div100vh style={{height: '80rvh', display: 'flex', flexDirection: 'column'}}>
              <h3 style={{color: '#0F0'}}>How To Play</h3>
              <div style={{flex: 2}}>
                <HowTo />
              </div>
              <p><button className={buttons.red} onClick={()=>{this.setState({show: null})}}>Back</button></p>
            </Div100vh>
        )

        let popup = null;

        if(this.state.show == 'about'){
            popup = (<Popup contents={about}/>)
        } else if(this.state.show == 'howto') {
            popup = (<Popup contents={howto}/>)
        }

        return (
            <Div100vh className={styles.home}>
              <div className={styles.logo}>
                <video id="vid" width="100%" height="100%" objectfit="contain" autoPlay playsInline loop >
                  <source src={logo} type="video/mp4" />
                </video>
              </div>
              <div className={styles.buttons}>
                <button className={buttons.red} onClick={()=>{this.setState({show: 'about'})}}>About</button>
                <button className={buttons.green} onClick={()=>{this.setState({show: 'howto'})}}>How To Play</button>
                <Link to="/lobby">
                  <button className={buttons.blue}>Game Lobby</button>
                </Link>
              </div>
              {
              popup
              }
            </Div100vh>
        )
    }
}

export default Home;
