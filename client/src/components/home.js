import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import About from './about';
import logo from '../images/logo.mp4';

class Home extends Component {
    render() {
        return (
            <div>
                <video id="vid" width="100%" height="100%" autoPlay playsInline loop muted>
                <source src={logo} type="video/mp4" />
                </video>
            </div>
        )
    }
}

export default Home;
