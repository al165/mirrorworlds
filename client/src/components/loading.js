import React, { Component } from 'react';

import styles from '../css/style.module.css';
import loadAnim from '../images/logoalt.gif';

class Loading extends Component {
    render() {
        return (
                <div className={{styles.flexboxgif}}>
                <div className={{styles.flexitem}}
                    <img className={{styles.loading}}</img>
                </div>
                <div className={{styles.flexitem}}
                    <h2>Loading...</h2>
                </div>
                </div>
        )
    }
}
export default Loading;
