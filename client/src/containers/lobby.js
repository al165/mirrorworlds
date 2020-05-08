import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Div100vh from 'react-div-100vh';
import Ticker from 'react-ticker';

import GameList from '../components/gameList';
import Popup from '../components/popup';

import styles from '../css/lobby.module.css';
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
        console.log('getGames');
        //this.setState({loading: true});

        fetch(this.base_url + '/api/allgames')
            .then((res) => {
                return res.json();
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

        socket.on('game_list_updated', (data) => {
            console.log('game_list_updated');
            this.getGames();
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
        console.log('componentWillUnmount');
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
                    'username': newGameName
                })
            };
            // fetch
            fetch("https://mirrorworlds.io/api/creategame", request)
                .then((response, err) => {
                    if(response.status == 500 || err){
                        alert('Error...')
                        console.log(err);
                    } else {
                        return response.json();
                    }
                }).then((result) => {
                    // successfully created game...
                    //this.setState({create_game: false});
                    const gameID = result.gameID;
                    // save session cookie with username...
                    let sessionData = JSON.parse(window.sessionStorage.getItem('mw_user_data'));
                    if(!sessionData){
                        sessionData = {}
                    }
                    sessionData[gameID] = newGameName;
                    window.sessionStorage.setItem('mw_user_data', JSON.stringify(sessionData));
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

        return (
            <Div100vh className={styles.lobby}>

                <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                // Should work with class "flexboxgif" from style.module.css (that one also has padding)


                    <h1>Game Lobby</h1>

                    <Ticker direction="toLeft">{(index) => (<h3> ! Under construction ! </h3>)}</Ticker>
                    // Ticker style found as "marquee" in style.module.css
                   
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
