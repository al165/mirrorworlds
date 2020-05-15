import React, { Component } from 'react';
import { Link, useParams } from 'react-router-dom';
import Div100vh from 'react-div-100vh';
import Ticker from 'react-ticker';

import Loading from '../components/loading';
import Popup from '../components/popup';
import PlayerList from '../components/playerList';
import PreGame from '../components/pregame';
import CaptureContainer from '../containers/captureContainer';

import styles from '../css/style.module.css';
import buttons from '../css/buttons.module.css';

var socket;

class Game extends Component {

    constructor(props) {
        console.log('Game Component constructed');
        super(props);
        const gameID = this.props.match.params.id;

        socket = props.socket;

        this._isMounted = false;

        this.ticker_text = 'Loading...';

        //  check if session storage exists...
        let sessionData = JSON.parse(window.sessionStorage.getItem('mw_user_data'));

        this.state = {
            joining: false,
            gameID: gameID,
            userID: sessionData.userID,
            gameData: {
                players: {}
            }
        }

        console.log(this.state)
    }

    getGameData() {
        var request = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gameID: this.state.gameID
            })
        };
        fetch("https://mirrorworlds.io/api/gamedata", request)
            .then((response) => {
                if(response.status != 200){
                    //alert('Error getting game data...')
                    throw response.status;
                } else {
                    return response.json();
                }
            })
            .then((result) => {
                // check if we are in the game...
                console.log('getGameData', result);
                if(result.players[this.state.userID]){
                    if(this._isMounted){
                        this.setState({gameData: result});
                        // TODO need to re-emit 'game_joined' to subscribe to game updates!
                    } else {
                        console.log('getGameData()', 'not mounted');
                    }
                } else {
                    //show join box
                    if(this._isMounted){
                        this.setState({gameData: result, joining: true});
                    } else {
                        console.log('getGameData()', 'not mounted');
                    }
                }
            })
            .catch((err) => {
                this.props.history.push('/lobby');
                console.log(err);
            })
    }

    componentDidMount() {
        // fetch current game data...
        this.getGameData();
        this._isMounted = true;

        socket.on('game_updated', () => {
            console.log('game_updated');
            this.getGameData();
        });

        socket.on('game_deleted', () => {
            this.props.history.push('/lobby');
            alert('Game deleted due to inactivity...');
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
        socket.emit('game_leave', this.state.gameID);
    }

    makeJoinRequest(gameID, username){
        console.log('makeJoinRequest', gameID, username);
        var request = {
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
                socket.emit('joined_game', gameID);
                this.setState({joining: false});
                this.getGameData();
            })
            .catch((err) => {
                console.log(err);
            })

    }

    joinGame(e){
        if(e) e.preventDefault();

        const username = this.input.value;
        if(username.match(/^[ 0-9a-zA-Z]{1,16}$/)) {
            this.makeJoinRequest(this.state.gameID, username);
        } else {
            alert('Name must only contain letters and numbers, max 16 characters!');
        }
    }

    render() {
        var joinGameForm = (
                <div>
                <form onSubmit={this.joinGame.bind(this)} >
                        <input type="text" id="gamename" placeholder="Enter Username"
                            ref={(element) => {this.input=element}} />
                        <button className={buttons.green}>Join!</button>
                        <Link to="/lobby">
                            <button className={buttons.red}>Back</button>
                        </Link>
                    </form>
                </div>
        )

        var screen = null;

        if(this.state.gameData.state == 'game_wait'){
            screen = (<PreGame gameData={this.state.gameData}
                      userID={this.state.userID}
                      gameID={this.state.gameID} />)
        } else if(this.state.gameData.state == 'capture'){
            screen = (<CaptureContainer gameData={this.state.gameData} />);
        } else {
            screen = (<Loading />);
        }
                    //<div className={`${styles.marquee} ${styles.high}`}>
                    //    <Ticker>{((index) => (<h3 style={{whiteSpace: "nowrap"}}>{this.ticker_text} --- </h3>))}</Ticker>
                    //</div>

        return (
                <Div100vh>
                    {screen}
                    {this.state.joining ?
                    <Popup contents={joinGameForm}/>
                    : null
                    }
                </Div100vh>
        )
    }
}

export default Game
