import React, { Component } from 'react';
import Ticker from 'react-ticker';

import Loading from '../components/loading';
import Judging from '../components/judging';
import TopTicker from '../components/topTicker';
import PhotoView from '../components/photoView';
import Countdown from '../components/countdown';

import styles from '../css/style.module.css';


class JudgeContainer extends Component {

    constructor(props){
        super(props);

        this.state = {
            mode: 'splash',
            current_guess: null,
            show_photo: false,
        }
    }

    componentDidMount() {
        this.countdown = new Countdown(this.props.gameData.nextstate);

        var submissions = this.props.gameData.submissions;
        this.guesses = [];
        this.submission = null;

        for (var subID of Object.keys(submissions)){
            if (subID == this.props.userID && submissions[subID][subID]){
                this.submission = submissions[subID][subID].photo
                continue;
            }

            const sub = submissions[subID][this.props.userID];
            if (sub && !sub.judgement) {
                this.guesses.push({
                    subID: subID,
                    photo: sub.photo,
                });
            }
        }

        this.startTimer = setTimeout(() => {
            if (!this.submission){
                this.setState({mode: 'finished_nothing'});
            } else if (this.guesses.length == 0) {
                this.setState({mode: 'finished_empty'});
            } else {
                this.setState({mode: 'see'})
                this.startTimer = setTimeout(() => {
                    this.getGuess();
                }, 3000);
            }
        }, 3000);

        this.setState({will_judge: this.submission ? true : false});
    }

    componentWillUnmount() {
        this.countdown.deconstruct();
        clearTimeout(this.startTimer);
    }

    getGuess(){
        var guess = this.guesses.pop();
        //console.log('[getGuess]');
        if(!guess){
            // finished judging!
            this.setState({mode: 'finished', current_guess: null, show_photo: false})
        } else {
            this.setState({mode: 'judging', current_guess: guess, show_photo: true})
        }
    }

    sendJudgement(targetID, judgement) {
        //console.log('[sendJudgement]', targetID, judgement);

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
                judgement: judgement
            })
        };
        fetch("https://mirrorworlds.io/api/submitjudgement", request)
            .then((response) => {
                if(response.status != 200){
                    throw response.status;
                } else {
                    return response
                }
            })
            .then((result) => {
                //console.log('[sendJudgement]', 'success');
                if(this.guesses.length == 0){
                    this.setState({mode: 'finished', current_guess: null, show_photo: false})
                } else {
                    this.setState({show_photo: false})
                    this.startTimer = setTimeout(() => {
                        this.getGuess();
                    }, 1500);
                }
            })
            .catch((err) => {
                console.log('Could not send judgement');
                console.log(err);
            })
    }

    render() {
        var screen = (<Loading />);
        var showTicker = false;

        if(this.state.mode == 'splash'){
            screen = (<Loading msg={(<h2>JUDGE</h2>)}/>);
        } else if(this.state.mode == 'judging'){
            showTicker = true;
            screen = (<div></div>);
        } else if(this.state.mode == 'see'){
            screen = (<Judging />);
        } else if(this.state.mode == 'finished'){
            screen = (<Loading msg={(<h3>Well Done! Waiting for everyone else.</h3>)}/>);
        } else if(this.state.mode == 'finished_nothing'){
            screen = (<Loading msg={(<>
                                        <h3>You did not submit a photo this round</h3>
                                        <p>Waiting for round to finish</p>
                                     </>)} />)
        } else if(this.state.mode == 'finished_empty'){
            screen = (<Judging  nothing />);
            //screen = (<Loading msg={(<>
            //                            <h3>No one could guess your photo</h3>
            //                            <p>Waiting for round to finish</p>
            //                         </>)} />)
        }

        var tickerText = null;
        let guess = this.state.current_guess;

        if(!guess){
            guess = {photo: null, subID: null}
        } else {
            const username = this.props.gameData.players[guess.subID].username;
            tickerText = (<>Did <span style={{color: '#0F0'}}>{username}</span> get it correct?</>);
        }

        //console.log(this.state.show_photo);

        return (
            <div>
              <TopTicker mode="JUDGE" round="3"/>
              {screen}
              <PhotoView photo={guess.photo}
                         showPhoto={this.state.show_photo}
                         accept={()=>{this.sendJudgement(guess.subID, true)}}
                         reject={()=>{this.sendJudgement(guess.subID, false)}}/>
              {tickerText && showTicker ? (<div className={`${styles.marquee} ${styles.low}`}>
                <h3>
                  <span className={styles.tickertext}>{tickerText}</span>
                </h3>
               </div>) : null}
            </div>
        )
    }
}

export default JudgeContainer;
