import React from 'react';

import styles from '../css/lobby.module.css';

function PlayerList(props) {
    if(!props.playerList){
        return (<h3>Loading...</h3>)
    }

    var playerList = [];
    var username = props.username;

    for (var k in props.playerList){
        if(props.playerList.hasOwnProperty(k)){
            var player = props.playerList[k];
            playerList.push({
                playerID: k,
                username: player.username,
                score: player.score
            })
        }
    }

    if(playerList.length == 0){
        return (<>
                <div className={styles.centered}>
                    <p>No players yet...</p>
                </div>
               </>)
    } else {
        return (
            <div className={styles.table}>
            <table id="t">
            <colgroup>
                <col className={styles.w} />
                <col className={styles.y} />
                <col className={styles.y} />
            </colgroup>
            <thead>
                <tr>
                <th>Name</th>
                <th>Score</th>
                </tr>
            </thead>
            <tbody>
                {
                playerList.map(p => (
                    <tr key={p.playerID}>
                        <td>{p.username == username ? p.username : p.username}</td>
                        <td>{p.score}</td>
                    </tr>
                    ))
                }
            </tbody>
            </table>
            </div>
        );
    }
}

export default PlayerList;
