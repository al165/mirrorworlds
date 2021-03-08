import React from 'react';

import cry from '../images/cry.gif';
import light from '../images/light.gif';
import styles from '../css/style.module.css';

function AllSent(props) {
    let title = "All pictures captured!";
    let message = "Great Work! Please wait until everyone else has finished";
    if (props.nothing){
        title = "Nothing to do"
        message = "No one has anything for you to find...";
    }
    return (
            <div className={`${styles.flexboxgif} ${styles.allpictures}`}>
                <div className={styles.flexitem}>
                  <img src={props.nothing ? cry : light}></img>
                </div>
                <div className={styles.flexitem}>
                  <h3>{title}</h3>
                  <p>{message}</p>
                </div>
            </div>
    )
}

export default AllSent;
