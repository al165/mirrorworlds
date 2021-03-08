import React from 'react';

import gallery from '../css/gallery.module.css';

import ButtonYes from '../images/yes.svg';
import ButtonNo from '../images/no.svg';


function PhotoView(props){
    var imgstyle = {};
    var buttonsstyle = {};


    if(props.showPhoto && props.photo){
        imgstyle['opacity'] = '1';
        imgstyle['scale'] = '1';
        buttonsstyle['bottom'] = '6vh';
    } else {
        imgstyle['opacity'] = '0';
        imgstyle['scale'] = '0.8';
        buttonsstyle['bottom'] = '-20vh';
    }

    return (
        <>
          <div className={gallery.photoview}>
              <img className={gallery.enlarge} src={props.photo} style={imgstyle}/>
          </div>
          <div className={gallery.buttonbox} style={buttonsstyle}>
            <div style={{width: '12vh', height: '12vh'}}>
              <ButtonNo fill='#F00' width='12vh' onClick={props.reject} />
            </div>
            <div style={{width: '12vh', height: '12vh'}}>
              <ButtonYes fill='#0F0' width='12vh' height='12vh' onClick={props.accept} />
            </div>
          </div>
        </>
    )
}

export default PhotoView
