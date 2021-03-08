import React, { Component } from 'react';
import Div100vh from 'react-div-100vh';
import Ticker from 'react-ticker';

import Loading from '../components/loading';
import Gallery from '../components/gallery';
import PhotoView from '../components/photoView';
import Countdown from '../components/countdown';
import CameraScreen from '../containers/cameraScreen';
import styles from '../css/style.module.css';

import test1 from '../images/test1.png';
import test2 from '../images/test2.png';

class CameraTest extends Component {

    constructor(props) {
        super(props);

        this.state = {
            photo: null,
            showPhoto: false
        };
    }

    onEnlarge(photo) {
        this.setState({photo: photo, showPhoto: true})
    }

    componentDidMount() {
        this.countdown = new Countdown(Date.now() + 1000 * 60);
    }

    render() {
        return (
            <Div100vh>
            <div className={`${styles.marquee} ${styles.high}`}>
            <Ticker direction="toLeft" offset="run-in">
            {((index) => (
                    <h3>
                    <span className={styles.tickertext}>
                    TESTING 1 2 3
                    </span>
                    </h3>)
                )}
            </Ticker>
            </div>

            <div className={`${styles.marquee} ${styles.low}`}>
            <Ticker direction="toLeft" offset="run-in">
            {((index) => (
                    <h3>
                    <span className={styles.tickertext}>
                    This is the TEST PAGE
                    </span>
                    </h3>)
                )}
            </Ticker>
            </div>

              {/*
                  <Gallery photos={[{photo: test1, targetID: 'asdfg'}, {photo: test2, targetID: 'lkjhg'}]}
                           submitted={[]}
                           enlarge={(p, id)=>{this.onEnlarge(p)}}/>

                  <PhotoView photo={this.state.photo} showPhoto={this.state.showPhoto}
              accept={()=>{alert('Not implemented yet')}}
              reject={()=>{this.setState({showPhoto: false})}}/>
              */}
              <CameraScreen />

            </Div100vh>
        )
    }
}

export default CameraTest;
