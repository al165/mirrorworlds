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

//class CreateGamePopup extends Component {
//
//    createGame(e) {
//        if(e) e.preventDefault();
//
//        const newGameName = this.input.value;
//        if(newGameName.match(/^[ 0-9a-zA-Z]{1,16}$/)) {
//            var request = {
//                method: 'POST',
//                headers: {
//                    'Accept': 'application/json',
//                    'Content-Type': 'application/json'
//                },
//                body: JSON.stringify({
//                    'username': newGameName
//                })
//            };
//            // fetch
//            fetch("https://mirrorworlds.io/api/creategame", request)
//                .then((response) => {
//                    return response.json();
//                }).then((result) => {
//                    console.log('[CreateGamePopup]', result);
//                    const gameID = result.id;
//                    // save session cookie with username...
//                    window.sessionStorage.setItem('mw_user_data', JSON.stringify({
//                        username: newGameName
//                    }));
//                    this.props.history.push('/game/'+gameID);
//                }).catch((err) => {
//                    console.log(err);
//                    alert('Error creating game :(');
//                })
//        } else {
//            alert('Name must only contain letters and numbers, max 16 characters!');
//        }
//    }
//
//    render() {
//        return (
//            <div id="popup">
//                <div id="popupInner">
//                    <form onSubmit={this.props.createGame} >
//                        <input type="text" id="gamename" placeholder="Enter Username"
//                            ref={(element) => {this.input=element}} />
//                        <button className={buttons.green} onClick={this.createGame.bind(this)}>Create!</button>
//                    </form>
//                    <button className={buttons.red} onClick={this.props.closePopup}>Cancel</button>
//                </div>
//            </div>
//        )
//    }
//
//}
//
//export default CreateGamePopup;
