import React, { Component } from 'react';
import Ticker from 'react-ticker';

import Loading from '../components/loading';
import TopTicker from '../components/topTicker';
import Countdown from '../components/countdown';
import Submitted from '../components/submitted';
import CameraScreen from '../containers/cameraScreen';

import styles from '../css/style.module.css';

class CaptureContainer extends Component {

    constructor(props){
        super(props);

        this.state = {
            submission: null,
            nextstate: this.props.gameData.nextstate,
            mode: 'splash'
        }
    }

    componentDidMount(){
        this.countdown = new Countdown(this.props.gameData.nextstate);

        var submissions = this.props.gameData.submissions[this.props.userID];
        if(submissions && submissions[this.props.userID]){
            //console.log('already submitted...');
            this.setState({submission: submissions[this.props.userID]})
        }

        this.startTimer = setTimeout(() => {
            this.setState({mode: 'capture'})
        }, 3000);
    }

    componentWillUnmount(){
        this.countdown.deconstruct();
        if(this.startTimer){
            clearTimeout(this.startTimer);
        }
    }

    updateTicker(message) {
        document.getElementById('ticker_top').innerHTML = message;
    }

    submitPhoto(photo){
        var request = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gameID: this.props.gameID,
                userID: this.props.userID,
                targetID: this.props.userID,
                image: photo,
                time: 0
            })
        };
        fetch("https://mirrorworlds.io/api/submitobject", request)
            .then((response) => {
                if(response.status != 200){
                    throw response.status;
                } else {
                    return response;
                }
            })
            .then((result) => {
                //console.log('Successfully sent photo');
                this.setState({submission: photo, mode: 'finished'});
            })
            .catch((err) => {
                console.log(err);
                alert('Error sending photo...');
            })
    }

    render() {
        var screen = null;
        var show_ticker = false;

        if(this.state.mode == 'splash'){
            screen = (<Loading msg={(<h2>CAPTURE</h2>)} />);

        } else if(this.state.mode == 'capture'){
            show_ticker = true;
            screen = (<CameraScreen submitPhoto={this.submitPhoto.bind(this)} />);

        } else if(this.state.mode == 'finished'){
            screen = (<Submitted />);

        } else {
            //console.log(this.state.mode);
            screen = (<Loading />)
        }

        return (
            <>
              <TopTicker mode="CAPTURE" round="1" />
              {screen}

              {show_ticker ? (
              <div className={`${styles.marquee} ${styles.low}`}>
                <Ticker direction="toLeft" offset="run-in" speed={7}>
                {((index) => (
                        <h3>
                        <span className={styles.tickertext}>
                        Take a photo of something for the other players to find
                        </span>
                        </h3>)
                    )}
                </Ticker>
              </div>) : null}
            </>
        )
    }
}

export default CaptureContainer;
