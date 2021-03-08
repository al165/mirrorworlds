import React, { Component } from 'react';
import Ticker from 'react-ticker';

import Countdown from '../components/countdown';
import PlayerList from '../components/playerList';

import Exit from '../images/exit.svg';

import styles from '../css/style.module.css';
import buttons from '../css/buttons.module.css';


class PostGame extends Component {

    componentDidMount(){
        this.countdown = new Countdown(this.props.gameData.nextstate);
        if (this.props.gameData.players[this.props.userID]){
            this.username = this.props.gameData.players[this.props.userID];
        } else {
            this.username = ''
        }
    }

    componentWillUnmount(){
        this.countdown.deconstruct();
    }

    render(){
        return (
            <>
            <div className={styles.flexcontainer}>
              <h1>Leaderboard</h1>
              <div style={{width: '100%'}}>
                <Ticker direction="toLeft" offset="run-in" speed={7}>
                  {()=> (
                      <h3>
                        <span className={styles.tickertext}>
                          Round finished
                        </span>
                      </h3>)}
                </Ticker>
              </div>
              <div style={{flex: 2, overflow: 'auto', width: '100%'}}>
                <PlayerList playerList={this.props.gameData.players} username={this.username}/>
              </div>
              <div style={{flex: 1, display: 'flex', flexDirection: 'row', width: '70vw', alignItems: 'center'}}>
                <div style={{width: '16vh', height: '16vh', padding: '5vw'}}>
                  <Exit fill='white' onClick={this.props.quit} />
                </div>
                <div style={{width: '70%'}}>
                  <h3><p>Next game starts in</p>
                    <span className="timertext"></span>
                  </h3>
                </div>
              </div>
            </div>
            </>
        )
    }
}

export default PostGame
