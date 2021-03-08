import React, { PureComponent } from 'react';

import Thumbnail from '../components/thumbnail';

import gallery from '../css/gallery.module.css';

const AUTOSCROLL_WAIT = 3000;
const ACTIVATION_START = 20;
const THUMB_WIDTH = 30;
const THUMB_PADDING = 1;


class Gallery extends PureComponent {

    constructor(props) {

        console.log('contructor');
        super(props)

        this.items = [];

        this.container = React.createRef();
        this.isScrolling = false;
        this.isPressed = false;

        this.startX = 0;
        this.dragOffset = 0;
        this.scrollPosition = 0;

        this.autoScroll = true;
        this.autoScrollTimeout = null;
        this.isMoving = false;

        this.photosWidth = 0.01 * window.innerWidth * (THUMB_WIDTH + THUMB_PADDING) * props.photos.length;
        this.repetitions = Math.floor(window.innerWidth / this.photosWidth) + 3;

        for(var j=0; j<this.repetitions; j++){
            for(var i=0; i<props.photos.length; i++){
                var el = (
                    this.items.push(<Thumbnail key={'t'+j+'_'+i} photo={props.photos[i]} />)
                )
            }
        }

        console.log('constructor', this.items);
    }

    componentDidMount() {
        window.addEventListener('touchmove', this.onTouchMove.bind(this), {passive: false});
        window.addEventListener('touchend', this.onTouchEnd.bind(this));

        this.animate();
    }

    componentWillUnmount() {
        window.removeEventListener('touchmove', this.onTouchMove)
        window.removeEventListener('touchend', this.onTouchEnd)
    }

    onTouchMove(e){
        const touch = e.touches[0];
        if(touch){
            if(!this.isPressed){
                this.startX = touch.clientX;
                this.isPressed = true;
                this.autoScroll = false;
                clearTimeout(this.autoScrollTimeout);
            }

            const move = touch.clientX - this.startX;
            if(Math.abs(move) > ACTIVATION_START){
                this.isScrolling = true;

                this.dragOffset = move;
                this.setPosition();
            }
        }
    }

    onTouchEnd(e){
        this.isPressed = false;
        this.isScrolling = false;
        this.scrollPosition += this.dragOffset;
        this.dragOffset = 0;

        this.autoScrollTimeout = setTimeout(()=>{
            this.autoScroll = true;
        }, AUTOSCROLL_WAIT);
    }

    animate(){
        if (this.isMoving) return;
        this.isMoving = true;

        let prevTimeStep = null

        const step = (timeStep) => {
            if(!this.isMoving) return

            if(this.autoScroll){
                const progress = prevTimeStep ? timeStep - prevTimeStep : 0

                this.scrollPosition -= (progress/100 * 3);
                this.setPosition()
            }

            prevTimeStep = timeStep;
            window.requestAnimationFrame(step);
        }

        window.requestAnimationFrame(step);
    }

    setPosition(){
        var x = (this.dragOffset + this.scrollPosition) % this.photosWidth;
        x -= this.photosWidth;
        this.container.current.style.transform = `translateX(${x}px)`;
    }

    render(){
        console.log('render', this.items);
        return (
            <div className={gallery.gallery} ref={this.container}>
              {
                  this.items.map((item, index) => (
                    <div key={index}>
                        {item}
                    </div>
                  ))
              }
            </div>
        )

    }
}

export default Gallery
