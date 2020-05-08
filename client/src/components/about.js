import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Div100vh from 'react-div-100vh';
import Carousel from 're-carousel';
import IndicatorDots from './indicatorDots';

import buttons from '../css/buttons.module.css';

class About extends Component {
    /* TODO */
    render() {
        return (
            <Div100vh>
                <div style={{height: "80%"}}>
                <Carousel widgets={[IndicatorDots]}>
                    <div style={{backgroundColor: '#0F0', height: '100%'}}Frame 1</div>
                    <div style={{backgroundColor: 'blue', height: '100%'}}>Frame 2</div>
                <div style={{backgroundColor: 'red', height: '100%'}}>Frame 3</div>
                </Carousel>
                </div>
                <div style={{height: "20%"}}>
                <Link to='/'>
                <button className={buttons.red}>Back</button>
                </Link>
                </div>
            </Div100vh>
        )
    }
}

export default About;
