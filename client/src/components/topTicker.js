import React from 'react';
import Ticker from 'react-ticker';

import styles from '../css/style.module.css';

function TopTicker(props) {

    return (
        <div className={`${styles.marquee} ${styles.high}`}>
          <Ticker direction="toLeft" offset="run-in">
            {() => (
                <h3>
                  <span className={styles.tickertext}>
                    ROUND {props.round}
                  </span>
                  <span className={styles.tickertext}>
                    <span className="timertext"></span>
                  </span>
                  <span className={styles.tickertext}>
                    {props.mode}
                  </span>
                  <span className={styles.tickertext}>
                    <span className="timertext"></span>
                  </span>
                </h3>)
            }
          </Ticker>
        </div>
    )
}

export default TopTicker
