import React, { Component } from 'react';
import Ticker from 'react-ticker';

import PlayerList from '../components/playerList';

import styles from '../css/style.module.css';
import buttons from '../css/buttons.module.css';


function PreGame(props){

    var username;
    if (props.gameData.players[props.userID]){
        username = props.gameData.players[props.userID].username;
    } else {
        username ='';
    }

    var numplayers = Object.keys(props.gameData.players).length;
    var startbutton = null;

    var requestStart =  function() {
        var request = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'gameID': props.gameID
            })
        };
        // Don't care about response?
        fetch("https://mirrorworlds.io/api/startgame", request);
    }

    var is_owner = props.gameData.owner == username;
    let ticker_text = (<span className={styles.tickertext}>Joining <span style={{color: '#0F0'}}>{props.gameData.owner}'s</span> game </span>);

    if (is_owner){
        if (numplayers < 2){
            ticker_text = (<span className={styles.tickertext}>Waiting for people to join</span>);
        } else {
            ticker_text = (<span className={styles.tickertext}>Click <span style={{color: '#0F0'}}>Start Game</span> to begin</span>);
        }
    }

    if (numplayers > 1 && is_owner){
        startbutton = (
                <button className={buttons.green} onClick={requestStart}>Start Game!</button>
        )
    }

    return (
        <>
          <div className={styles.flexcontainer}>
            <h1>Wait For Start</h1>
            <div style={{width: "100%"}} >
              <Ticker>{(() => (<h3>{ticker_text}</h3>))}</Ticker>
            </div>
            <div style={{flex: 2, overflow: "auto", width: '100%'}}>
                <PlayerList playerList={props.gameData.players} username={username}></PlayerList>
            </div>
            <div style={{flex: 1, width: '100%',}}>
                {startbutton}
            </div>
            <div style={{flex: 1, width: '100%',}}>
                <p>Invite friends to join by sharing this link:</p>
                <p><u>mirrorworlds.io/game/{props.gameID}</u></p>
            </div>
            </div>
        </>
    )
}

export default PreGame;
