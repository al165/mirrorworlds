import React from 'react';

import see from '../images/see.gif';
import sad from '../images/sad.gif';
import styles from '../css/style.module.css';

function Judging(props) {
    var message = "Let's see if anyone were able to find your photo...";
    var title = "How did the others do?";

    if(props.nothing){
        message = "Waiting for the other players";
        title = "No one guessed you photo";
    }

    return (
            <div className={`${styles.flexboxgif} ${styles.picturesent}`}>
                <div className={styles.flexitem}>
                  <img src={props.nothing ? sad : see}></img>
                </div>
                <div className={styles.flexitem}>
                  <h3>{title}</h3>
                  <p>{message}</p>
                </div>
            </div>
    )
}

export default Judging;
