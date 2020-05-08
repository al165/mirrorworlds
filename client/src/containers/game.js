import React, { Component } from 'react';
import { Link, useParams } from 'react-router-dom';
import Div100vh from 'react-div-100vh';
import Ticker from 'react-ticker';

import Popup from '../components/popup';
import PlayerList from '../components/playerList';

import buttons from '../css/buttons.module.css';

class Game extends Component {

    constructor(props) {
        console.log('Game Component constructed');
        super(props);
        const gameID = this.props.match.params.id;

        this.state = {
            joining: false,
            gameID: gameID,
            gameData: {
                players: {}
            }
        }
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
                    alert('Error getting game data...')
                } else {
                    return response.json();
                }
            })
            .then((result) => {
                console.log('recieved game data...')
                console.log(result);
                this.setState({gameData: result});
            })
            .catch((err) => {
                console.log(err);
            })
    }

    componentDidMount() {
        // fetch current game data...
        this.getGameData();

        // check if session storage exists...
        let sessionData = window.sessionStorage.getItem('mw_user_data');

        if(sessionData && sessionData != ''){
            console.log('found session data!');
            var user_data = JSON.parse(sessionData);
            if(user_data[this.state.gameID]){
                // player has been here before....
                console.log('Welcome back!');

            } else {
                // player is new...
                console.log('player new!');
                this.setState({joining: true});
            }
        } else {
            console.log('no data!');
            this.setState({joining: true});
        }
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
                gameID: gameID
            })
        };

        fetch("https://mirrorworlds.io/api/joingame", request)
            .then((response) => {
                if(response.status != 200){
                    alert('Error...')
                } else {
                    return response.json();
                }
            })
            .then((result) => {
                // successfully joined game, update session storage
                let sessionData = JSON.parse(window.sessionStorage.getItem('mw_user_data'));
                if(!sessionData){
                    sessionData = {}
                }
                sessionData[gameID] = username;
                window.sessionStorage.setItem('mw_user_data', JSON.stringify(sessionData));
                console.log('Joined game!');
                this.setState({joining: false});
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
        return (
                <Div100vh>
                    <h1>GAME SCREEN</h1>
                    <Ticker direction="toLeft">{(index) => (<h3> ! Under construction ! </h3>)}</Ticker>
                <PlayerList playerList={this.state.gameData.players}>
                </PlayerList>
                    {this.state.joining ?
                    <Popup contents={joinGameForm}/>
                    : null
                    }
                </Div100vh>
        )
    }
}

export default Game
