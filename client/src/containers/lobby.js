import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Div100vh from 'react-div-100vh';
import Ticker from 'react-ticker';

import GameList from '../components/gameList';
import Popup from '../components/popup';

import lobby from '../css/lobby.module.css';
import styles from '../css/style.module.css';
import buttons from '../css/buttons.module.css';

var socket;

class Lobby extends Component {
    /* TODO */

    constructor(props) {
        super(props);

        this.base_url = 'https://mirrorworlds.io';
        this._isMounted = false;

        socket = props.socket;

        this.state = {
            game_list: null,
            loading: false,
            create_game: false
        };
    }

    getGames() {
        fetch(this.base_url + '/api/allgames')
            .then((res) => {
                if(res.status == 200){
                    return res.json();
                } else {
                    throw res.status;
                }
            })
            .then((game_list) => {
                if(this._isMounted){
                    this.setState({game_list: game_list});
                }
            })
            .catch((err) => {
                if(this._isMounted){
                    this.setState({loading: false});
                }
                console.log('getGames()', err);
            });
    }

    componentDidMount() {
        this._isMounted = true;
        this.getGames();

        let sessionData = JSON.parse(window.sessionStorage.getItem('mw_user_data'));
        if(sessionData && sessionData.userID){
            this.setState({userID: sessionData.userID});
        } else {
            console.log('no session data...');
            socket.connect();
        }

        socket.on('game_list_updated', (data) => {
            console.log('game_list_updated');
            this.getGames();
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
        socket.on('game_list_updated', (data)=>{});
    }

    toggleCreateGamePopup() {
        if(this._isMounted){
            this.setState({create_game: !this.state.create_game});
        }
    }

    createGame(e) {
        if(e) e.preventDefault();

        const newGameName = this.input.value;
        if(newGameName.match(/^[ 0-9a-zA-Z]{1,16}$/)) {
            var request = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'username': newGameName,
                    'userID': this.state.userID
                })
            };
            // fetch
            fetch("https://mirrorworlds.io/api/creategame", request)
                .then((response, err) => {
                    if(response.status != 200 || err){
                        throw err;
                    } else {
                        return response.json();
                    }
                }).then((result) => {
                    const gameID = result.gameID;
                    if(result.shouldjoin){
                        socket.emit('joined_game', gameID);
                    }
                    return gameID;
                }).then((gameID)=>{
                    this.props.history.push('/game/'+gameID);
                }).catch((err) => {
                    console.log(err);
                    alert('Error creating game :(');
                })
        } else {
            alert('Name must only contain letters and numbers, max 16 characters!');
        }
    }

    render() {
        console.log('lobby render');
        var createGameForm = (
                <div>
                <form onSubmit={this.createGame.bind(this)} >
                        <input type="text" id="gamename" placeholder="Enter Username"
                            ref={(element) => {this.input=element}} />
                        <button className={buttons.green}>Create!</button>
                    </form>
                <button className={buttons.red} onClick={this.toggleCreateGamePopup.bind(this)}>Cancel</button>
                </div>
        )

                // Ticker style found as "marquee" in style.module.css}
                // Should work with class "flexboxgif" from style.module.css (that one also has padding)}
                //<div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                //<div className={styles.flexboxgif}>
        return (
            <Div100vh className={lobby.lobby}>
                <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <h1>Game Lobby</h1>
                <Ticker direction="toLeft">
                {(index) => (<h3 style={{whiteSpace: "nowrap"}}>
                             <span className={styles.tickertext}>Welcome to MIRROR WORLDS</span>
                             </h3>)}
                </Ticker>
                    <div style={{flex: 2, overflow: "auto"}}>
                        <GameList gameList={this.state.game_list} joinFunction={this.joinGame}/>
                    </div>
                    <div style={{flex: 1}}>
                        <button className={buttons.green} onClick={this.toggleCreateGamePopup.bind(this)}>Create New Game</button>
                        <Link to='/'>
                        <button className={buttons.red}>Back</button>
                        </Link>
                    </div>
                </div>
                <div>
                  {this.state.create_game ?
                   <Popup contents={createGameForm}/>
                   : null
                  }
                </div>
            </Div100vh>
        )
    }
}

export default Lobby;
