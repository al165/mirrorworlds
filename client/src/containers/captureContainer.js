import React, { Component } from 'react';
import Ticker from 'react-ticker';

import Countdown from '../components/countdown';
import Submitted from '../components/submitted';
import CameraScreen from '../containers/cameraScreen';

import '../css/camera.css';
import styles from '../css/style.module.css';

class CaptureContainer extends Component {

    constructor(props){
        super(props);

        //console.log('CaptureContainer', 'constructor', props.gameData.nextstate);

        this.state = {
            submission: null,
            nextstate: this.props.gameData.nextstate
        }

    }

    componentDidMount(){
        this.countdown = new Countdown(this.state.nextstate);
    }

    componentWillUnmount(){
        this.countdown.deconstruct();
    }

    updateTicker(message) {
        document.getElementById('ticker_top').innerHTML = message;
    }

    submitPhoto(photo){
        console.log('submitPhoto!');
        this.setState({submission: photo});
    }

    render() {
        var screen = null;
        if(this.state.submission){
            screen = (<Submitted />);
        } else {
            screen = (<CameraScreen submitPhoto={this.submitPhoto.bind(this)} />);
        }

        return (
            <>
                <div className={`${styles.marquee} ${styles.high}`}>
                <Ticker direction="toLeft" offset="run-in">
                {((index) => (
                        <h3>
                        <span className="ticker_top" style={{color: 'white', padding: "0px 10px"}}>ROUND 1</span>
                        <span className="countdown-timer" style={{color: '#0F0', padding: "0px 10px"}}></span>
                        </h3>)
                 )}
                </Ticker>
                </div>
                {this.state.submission ? null : (<div className={`${styles.marquee} ${styles.low}`}>
                <Ticker direction="toLeft" offset="run-in" speed={7}>
                {((index) => (
                        <h3>
                        <span className={styles.tickertext}>
                        Take a photo of something for the other players to find!
                        </span>
                        </h3>)
                 )}
                </Ticker>
                </div>)}
                {screen}
            </>
        )
    }
}

export default CaptureContainer;
