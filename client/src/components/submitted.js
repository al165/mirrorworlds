import React from 'react';

import wink from '../images/wink.gif';
import styles from '../css/style.module.css';

function Submitted(props) {
    return (
            <div className={`${styles.flexboxgif} ${styles.picturesent}`}>
                <div className={styles.flexitem}>
                    <img src={wink}></img>
                </div>
                <div className={styles.flexitem}>
                    <h3>PICTURE Sent</h3>
                <p>Great Work! Please wait until everyone else has finished</p>
                </div>
            </div>
    )
}

export default Submitted;
