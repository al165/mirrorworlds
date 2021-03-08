import React, { Component } from 'react';

import styles from '../css/style.module.css';
import loadAnim from '../images/logoalt.mp4';
//import loadAnim from '../images/logoalt.gif';

function Loading(props) {
    var msg = (<h2>Loading...</h2>);
    if(props.msg){
        msg = props.msg;
    }

    return (
            <div className={styles.flexboxgif}>
                <div className={styles.flexitem}>
                  <video autoPlay playsInline loop muted width='80%'>
                    <source src={loadAnim} type="video/mp4" />
                  </video>
                </div>
                <div className={styles.flexitem}>
                    {msg}
                </div>
            </div>
    )
}
export default Loading;
