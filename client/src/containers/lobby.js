import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Div100vh from 'react-div-100vh';
import Ticker from 'react-ticker';

import GameList from '../components/gameList';
import Popup from '../components/popup';

import styles from '../css/lobby.module.css';
import buttons from '../css/buttons.module.css';

class Lobby extends Component {
    /* TODO */

    constructor(props) {
        super(props);

        this.base_url = 'https://mirrorworlds.io';

        this.state = {
            game_list: null,
            loading: false,
            create_game: false
        };
    }

    getGames() {
        this.setState({loading: true});

        fetch(this.base_url + '/api/allgames')
            .then((res) => {
                return res.json();
            })
            .then((game_list) => {
                this.setState({game_list: game_list, loading: false});
            })
            .catch((err) => {
                this.setState({loading: false});
                console.log('getGames()', err);
            });
    }

    componentDidMount() {
        this.getGames();
    }

    toggleCreateGamePopup() {
        this.setState({create_game: !this.state.create_game});
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
                .then((response) => {
                    return response.json();
                }).then((result) => {
                    const gameID = result.id;
                    // save session cookie with username...
                    window.sessionStorage.setItem('mw_user_data', JSON.stringify({
                        username: newGameName
                    }));
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
                    <h1>Game Lobby</h1>
                    <Ticker direction="toLeft">{(index) => (<h3> ! Under construction ! </h3>)}</Ticker>
                    <div style={{flex: 2, overflow: "auto"}}>
                        <GameList gameList={this.state.game_list} />
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


//function CreateGame(props) {
//    if(props.show) {
//        return (
//                <>
//                <form onSubmit={props.createGame} >
//                <input type="text" id="gamename" placeholder="Enter Username"
//            ref={(element) => {props.input=}}
//                </>
//        )
//
//    } else {
//        return (
//                <>
//                <button className={buttons.green} onClick={props.showEntryBox}>Create New Game</button>
//                </>
//        )
//    }
//}
