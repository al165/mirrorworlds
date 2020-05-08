import React, { Component } from 'react';

import styles from '../css/popup.css';

class Popup extends Component {

    render() {
        return (
            <div id="popup">
                <div id="popupInner">
                {this.props.contents}
                </div>
            </div>
        )
    }

}

export default Popup;
