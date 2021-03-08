import React from 'react';

import styles from '../css/popup.css';

function Popup(props) {

  return (
      <div id="popup">
        <div id="popupInner">
          {props.contents}
        </div>
      </div>
  )

}

export default Popup;
