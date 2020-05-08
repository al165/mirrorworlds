import React from 'react';
import { Link } from 'react-router-dom';

import styles from '../css/lobby.module.css';

function GameList(props) {
    if(!props.gameList){
        return (<h3>Loading...</h3>)
    } else if(props.gameList.length == 0){
        return (<>
                <div className={styles.centered}>
                    <h3>No Active Games</h3>
                    <p>You can start a new game below, then invite friends to join</p>
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
                <th>Current Games</th>
                <th style={{fontFamily: 'Mister Pixel ToolsOne'}}>L</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
                {
                props.gameList.map(g => (
                    <tr key={g.gameID}>
                        <td>{g.owner}'s game</td>
                        <td>{g.players}</td>
                        <td>
                        <Link to={`/game/${g.gameID}`}>
                            <button className={styles.join} style={{fontSize: "5vw", marginBottom: "15px"}}>Join</button>
                        </Link>
                        </td>
                    </tr>
                    ))
                }
            </tbody>
            </table>
            </div>
        );
    }
}

export default GameList;
