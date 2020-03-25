import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import logo from '../images/logo.mp4';
import buttons from '../css/buttons.css';

class Home extends Component {
    render() {
        return (
            <>
                <div>
                    <video id="vid" width="100%" height="100%" autoPlay playsInline loop muted>
                        <source src={logo} type="video/mp4" />
                    </video>
                </div>
                <div>
                    <Link to="/about">
                        <button className={buttons.red}>How To Play</button>
                    </Link>
                    <Link to="/lobby">
                        <button className={buttons.green}>Game Lobby</button>
                    </Link>
                </div>
            </>
        )
    }
}

export default Home;
