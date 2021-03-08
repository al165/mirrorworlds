import React, { Component } from 'react';
import { Link, useParams } from 'react-router-dom';
import Div100vh from 'react-div-100vh';
import Ticker from 'react-ticker';

import Loading from '../components/loading';
import Popup from '../components/popup';
import PlayerList from '../components/playerList';
import PreGame from '../components/pregame';
import PostGame from '../components/postGame';
import CaptureContainer from '../containers/captureContainer';
import SeekContainer from '../containers/seekContainer';
import JudgeContainer from '../containers/judgeContainer';

import Yes from '../images/yes.svg';
import No from '../images/no.svg';

import styles from '../css/style.module.css';
import buttons from '../css/buttons.module.css';

//var socket;

class Game extends Component {

    constructor(props) {
        //console.log('Game Component constructed');
        super(props);

        this.socket = props.socket;

        this._isMounted = false;
        this.ticker_text = 'Loading...';

        //  check if session storage exists...
        let sessionData = JSON.parse(window.sessionStorage.getItem('mw_user_data'));

        this.state = {
            joining: false,
            subscribed: false,
            quitting: false,
            userID: sessionData.userID,
            gameData: {
                players: {},
                submissions: {}
            }
        }
    }

    getGameData() {
        this.gameID = this.props.match.params.id;
        if(!this.gameID || this.game == ''){
            alert('Game not found');
            this.props.history.replace('/lobby');
        }
        //console.log('getting game data from gameID', this.gameID);
        const token = Math.floor((Math.random()*1000));
        //console.log('[getGameData]', 'gameID:', this.gameID, 'token:', token);

        let request = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            cache: 'no-cache',
            body: JSON.stringify({
                gameID: this.gameID,
                token: token,
                userID: this.state.userID
            })
        };
        fetch("https://mirrorworlds.io/api/gamedata", request)
            .then((response) => {
                //console.log('-- response', token);
                if(response.status != 200){
                    //alert('Error getting game data...')
                    throw response.status;
                } else {
                    return response.json();
                }
            })
            .then((result) => {
                // check if we are in the game...
                //console.log('getGameData', result);
                // subscribe to game updates
                this.socket.emit('joined_game', this.gameID);

                if(result.players[this.state.userID]){
                    if(this._isMounted){
                        //if(!this.state.subscribed){
                        //    // need to subscribe to game updates
                        //    this.socket.emit('joined_game', this.gameID);
                        //}
                        this.setState({gameData: result, subscribed: true});
                    } else {
                        //console.log('getGameData()', 'not mounted');
                    }
                } else {
                    //show join box
                    if(this._isMounted){
                        this.setState({gameData: result, joining: true});
                    } else {
                        //console.log('getGameData()', 'not mounted');
                    }
                }
            })
            .catch((err) => {
                //this.props.history.replace('/lobby');
                //alert('Error', token, err);
                console.log('[game]', 'getGameData', err);
            })
    }

    componentDidMount() {
        // fetch current game data...

        this.gameID = this.props.match.params.id;
        this.getGameData();
        this._isMounted = true;

        //console.log('Joining game', this.gameID);
        this.socket.on('game_updated', (gameID) => {
            //console.log('[socket]', 'game_updated', gameID, this.gameID);
            if (gameID == this.gameID){
                this.getGameData();
            } else {
                //console.log('[socket]', 'update of old game', gameID, this.gameID);
            }
        });

        this.socket.on('game_deleted', (gameID) => {
            if (gameID == this.gameID) {
                this.props.history.replace('/lobby');
                alert('Game deleted due to inactivity...');
            } else {
                console.log('game deleted', gameID, this.gameID);
            }
        });

        this.socket.on('reconnect', () => {
            //console.log('reconnected');
            this.getGameData();
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.socket.emit('game_leave', this.gameID);
    }

    makeJoinRequest(gameID, username){
        //console.log('makeJoinRequest', gameID, username);
        let request = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                gameID: gameID,
                userID: this.state.userID
            })
        };

        fetch("https://mirrorworlds.io/api/joingame", request)
            .then((response) => {
                if(response.status != 200){
                    throw response.status;
                } else {
                    return response.json();
                }
            })
            .then((result) => {
                this.socket.emit('joined_game', gameID);
                this.setState({joining: false});
                //this.getGameData();
            })
            .catch((err) => {
                console.log(err);
            })

    }

    joinGame(e){
        if(e) e.preventDefault();

        const username = this.input.value;
        if(username.match(/^[ 0-9a-zA-Z]{1,16}$/)) {
            this.makeJoinRequest(this.gameID, username);
        } else {
            alert('Name must only contain letters and numbers, max 16 characters!');
        }
    }

    quitGame(){
        this.socket.emit('leave_game', this.gameID);
        this.props.history.replace('/lobby');
    }

    render() {
        //console.log('[game]', this.state.gameData.state);
        const joinGameForm = (
                <div>
                    <form onSubmit={this.joinGame.bind(this)} >
                      <h3>Joining <span style={{color: '#0F0'}}>{this.state.gameData.owner}'s</span> Game</h3>
                        <input type="text" id="gamename" placeholder="Enter Username"
                            ref={(element) => {this.input=element}} />
                        <button className={buttons.green}>Join!</button>
                        <Link to="/lobby">
                            <button className={buttons.red}>Back</button>
                        </Link>
                    </form>
                </div>
        )

        const quitDialog = (
            <div>
              <h3>Are you sure you want to quit?</h3>
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}} >
                <div style={{width: '16vw', height: '16vw',}} >
                  <No onClick={()=>{this.setState({quitting: false})}}/>
                </div>
                <div style={{width: '16vw', height: '16vw',}} >
                  <Yes onClick={()=>{this.quitGame()}} />
                </div>
              </div>
            </div>
        )

        var screen = null;

        if(this.state.gameData.state == 'game_wait'){
            screen = (<PreGame gameData={this.state.gameData}
                      userID={this.state.userID}
                      gameID={this.gameID} />)
        } else if(this.state.gameData.state == 'capture'){
            screen = (<CaptureContainer gameData={this.state.gameData}
                      userID={this.state.userID}
                      gameID={this.gameID} />);
        } else if(this.state.gameData.state == 'seek'){
            screen = (<SeekContainer gameData={this.state.gameData}
                        userID={this.state.userID}
                        gameID={this.gameID} />);
        } else if(this.state.gameData.state == 'judge'){
            screen = (<JudgeContainer gameData={this.state.gameData}
                        userID={this.state.userID}
                        gameID={this.gameID} />);
        } else if(this.state.gameData.state == 'post_game'){
            screen = (<PostGame gameData={this.state.gameData}
                                userID={this.state.userID}
                                gameID={this.gameID}
                                quit={()=>{this.setState({quitting: true})}}/>);
        } else {
            screen = (<Loading />);
        }

        return (
            <Div100vh>
              {screen}
              {this.state.joining ?
               <Popup contents={joinGameForm} />
               : null
              }
              {this.state.quitting ?
               <Popup contents={quitDialog} />
               : null}
            </Div100vh>
        )
    }
}

export default Game
