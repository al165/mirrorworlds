import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Div100vh from 'react-div-100vh';

import logo from '../images/logo.mp4';
import styles from '../css/home.module.css';
import buttons from '../css/buttons.module.css';

class Home extends Component {
    render() {
        return (
            <Div100vh className={styles.home}>
                <div className={styles.logo}>
                    <video id="vid" width="100%" height="100%" objectFit="contain" autoPlay playsInline loop muted>
                        <source src={logo} type="video/mp4" />
                    </video>
                </div>
                <div className={styles.buttons}>
                    <Link to="/about">
                        <button className={buttons.green}>About</button>
                    </Link>
                    <Link to="/lobby">
                        <button className={buttons.blue}>Game Lobby</button>
                    </Link>
                </div>
            </Div100vh>
        )
    }
}

export default Home;
