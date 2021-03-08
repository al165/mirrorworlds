import React from 'react';

import Checked from '../images/check.svg';
import Unchecked from '../images/uncheck.svg';

import gallery from '../css/gallery.module.css';

function Thumbnail(props){

    const {photo, clicked, submitted = false} = props;

    var style = {
        filter: submitted ? 'grayscale(100%)' : 'none'
    };

    return (
        <div className={gallery.thumbnailbox}>
          <div className={gallery.checkbox}>
        {submitted ? <Checked fill='white' display='block' /> : <Unchecked fill='white' display='block'/>}
          </div>
          <img className={gallery.thumbnail} onClick={submitted ? null : clicked} src={photo} style={style}/>
        </div>
    )

}

export default Thumbnail;
