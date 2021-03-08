import React, { Component } from 'react';
import Ticker from 'react-ticker';

import Loading from '../components/loading';
import Gallery from '../components/gallery';
import TopTicker from '../components/topTicker';
import PhotoView from '../components/photoView';
import Countdown from '../components/countdown';
import CameraScreen from '../containers/cameraScreen';
import AllSent from '../components/allSent';

import styles from '../css/style.module.css';

class SeekContainer extends Component {

    constructor(props){
        super(props);

        // modes: splash, gallery, capture, finished, finished_nothing
        this.state = {
            mode: 'splash',
            targetID: null,
            photo: null,
            showPhoto: false,
        }
    }

    componentDidMount(){
        this.countdown = new Countdown(this.props.gameData.nextstate);

        this.photos = [];
        this.submitted = [];

        var submissions = this.props.gameData.submissions;
        console.log(submissions);

        for (var subID of Object.keys(submissions)){
            if (subID == this.props.userID){
                continue;
            }
            if(submissions[subID][subID]){
                this.photos.push(
                    {
                        photo: submissions[subID][subID].photo,
                        targetID: subID
                    })
            }
        }

        this.lastSubmitTime = Date.now();

        this.startTimer = setTimeout(() => {
            if (this.photos.length > 0){
                this.setState({mode: 'gallery'})
            } else {
                this.setState({mode: 'finished_nothing'})
            }
        }, 3000);
    }

    componentWillUnmount(){
        this.countdown.deconstruct();
        clearTimeout(this.startTimer);
    }

    enlarge(photo, targetID){
        //console.log('User clicked on photo from ', targetID);
        this.setState({photo: photo, showPhoto: true, targetID: targetID});
    }

    submitGuess(photo, targetID){
        //console.log('Submitting guess for', targetID);

        var request = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gameID: this.props.gameID,
                userID: this.props.userID,
                targetID: targetID,
                image: photo,
                time: Math.max(0, Date.now() - this.lastSubmitTime)
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
                this.submitted.push(targetID);
                this.lastSubmitTime = Date.now();

                this.setState({photo: null,
                               targetID: null,
                               showPhoto: false,
                               mode: this.submitted.length >= this.photos.length ? 'finished' : 'gallery'});
            })
            .catch((err) => {
                console.log(err);
                alert('Error sending photo...');
            })
    }

    render() {
        var screen = null;
        var showTicker = false;
        let tickerText = null;

        if(this.state.mode == 'splash'){
            screen = (<Loading msg={(<h2>SEEK</h2>)}/>);

        } else if(this.state.mode == 'gallery'){
            showTicker = true;
            if(this.state.showPhoto){
                tickerText = 'Can you find this?';
            } else {
                tickerText = 'Select an object to find';
            }
            screen = (
                <>
                  <Gallery photos={this.photos} submitted={this.submitted} enlarge={this.enlarge.bind(this)} />
                  <CameraScreen hideButtons />
                  <PhotoView photo={this.state.photo}
                             showPhoto={this.state.showPhoto}
                             accept={()=>{this.setState({mode: 'capture'})}}
                             reject={()=>{this.setState({showPhoto: false})}}/>
                </>
            )

        } else if(this.state.mode == 'capture'){
            showTicker = true;
            tickerText = 'Take a photo of the object';
            screen = (
                <CameraScreen backFunction={() => {this.setState({mode: 'gallery'})}}
                              submitPhoto={(photo) => {this.submitGuess(photo, this.state.targetID)}}/>
            )

        } else if(this.state.mode == 'finished'){
            screen = (<AllSent />);
        } else if(this.state.mode == 'finished_nothing'){
            screen = (<AllSent nothing />);
        } else {
            //console.log(this.state.mode);
            screen = (<Loading />);
        }

        return (
            <>
              <TopTicker mode="SEEK" round="2" />
              {screen}

              {showTicker ? (
                <div className={`${styles.marquee} ${styles.low}`}>
                    <Ticker direction="toLeft" offset="run-in" speed={7}>
                    {() => (
                            <h3>
                              <span className={styles.tickertext}>
                                {tickerText}
                              </span>
                            </h3>)
                    }
                    </Ticker>
                  </div>) : null}
            </>
        )
    }
}

export default SeekContainer;
