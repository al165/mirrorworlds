import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Div100vh from 'react-div-100vh';
import Carousel from 're-carousel';
import IndicatorDots from '../components/indicatorDots';

import HowTo1 from '../images/howto/howto-01.png';
import HowTo2 from '../images/howto/howto-02.png';
import HowTo3 from '../images/howto/howto-03.png';
import HowTo4 from '../images/howto/howto-04.png';
import HowTo5 from '../images/howto/howto-05.png';
import HowTo6 from '../images/howto/howto-06.png';
import HowTo7 from '../images/howto/howto-07.png';
import HowTo8 from '../images/howto/howto-08.png';

import buttons from '../css/buttons.module.css';
import styles from '../css/style.module.css';

function HowTo(props) {
  return (
      <div style={{height: "100%"}}>
        <Carousel widgets={[IndicatorDots]}>
          <div style={{backgroundColor: '#00F', height: '100%'}}>
            <img className={styles.howto} src={HowTo1}></img>
          </div>
          <div style={{backgroundColor: '#00F', height: '100%'}}>
            <img className={styles.howto} src={HowTo2}></img>
          </div>
          <div style={{backgroundColor: '#00F', height: '100%'}}>
            <img className={styles.howto} src={HowTo3}></img>
          </div>
          <div style={{backgroundColor: '#000', height: '100%'}}>
            <img className={styles.howto} src={HowTo4}></img>
          </div>
          <div style={{backgroundColor: '#000', height: '100%'}}>
            <img className={styles.howto} src={HowTo5}></img>
          </div>
          <div style={{backgroundColor: '#000', height: '100%'}}>
            <img className={styles.howto} src={HowTo6}></img>
          </div>
          <div style={{backgroundColor: '#000', height: '100%'}}>
            <img className={styles.howto} src={HowTo7}></img>
          </div>
          <div style={{backgroundColor: '#000', height: '100%'}}>
            <img className={styles.howto} src={HowTo8}></img>
          </div>
        </Carousel>
    {/*
      <div style={{height: "10%"}}>
        <Link to='/'>
          <button className={buttons.red}>Back</button>
        </Link>
      </div>
    */}
    </div>
  )
}

export default HowTo;
