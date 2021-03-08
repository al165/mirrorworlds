import React, { PureComponent } from 'react';

import Thumbnail from '../components/thumbnail';

import gallery from '../css/gallery.module.css';

const AUTOSCROLL_WAIT = 3000;
const ACTIVATION_START = 20;
const THUMB_WIDTH = 30;
const THUMB_PADDING = 1;


class Gallery extends PureComponent {

    constructor(props){
        super(props);

        this.container = React.createRef();
        this.isScrolling = false;
        this.isPressed = false;

        this.startX = 0;
        this.dragOffset = 0;
        this.scrollPosition = 0;

        this.autoScroll = true;
        this.autoScrollTimeout = null;
        this.isMoving = false;

        this.items = [];
        this.photosWidth = 0.01 * window.innerWidth * (THUMB_WIDTH + THUMB_PADDING) * props.photos.length;
        this.repetitions = Math.floor(window.innerWidth / this.photosWidth) + 3;

        if (props.photos && props.photos.length > 0){
            for(var j=0; j<this.repetitions; j++){
                for(var i=0; i<props.photos.length; i++){
                    let p = props.photos[i];
                    this.items.push(<Thumbnail clicked={()=>{props.enlarge(p.photo, p.targetID)}}
                                                key={'t'+j+'_'+i}
                                                photo={p.photo} />)
                }
            }

            this.doRender = true;
            this.animate();
        } else {
            this.doRender = false;
        }

    }

    componentDidMount() {
        window.addEventListener('touchmove', this.onTouchMove.bind(this), {passive: false});
        window.addEventListener('touchend', this.onTouchEnd.bind(this));

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
        if (this.isMoving || !this.render) return;
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
        if(this.container && this.container.current){
            this.container.current.style.transform = `translateX(${x}px)`;
        }
    }

    render(){
        if (!this.doRender){
            // gallery is empty...
            return null;
        }

        let items = []
        for(var j=0; j<this.repetitions; j++){
            for(var i=0; i<this.props.photos.length; i++){
                let p = this.props.photos[i];
                items.push(<Thumbnail clicked={()=>{this.props.enlarge(p.photo, p.targetID)}}
                                           key={'t'+j+'_'+i}
                                           submitted={this.props.submitted.includes(p.targetID)}
                                            photo={p.photo} />)
            }
        }

        return (
            <div className={gallery.gallery} ref={this.container}>
              {
                  items.map((item, index) => (
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

        //var photos = (
        //    <div className={gallery.gallery} >
        //        {
        //            this.items.map((item, index)=> (
        //                <div key={index}>
        //                    {item}
        //                </div>
        //            ))
        //        }
        //    </div>
        //);

        //// calculate the number of times to display gallery...

        //var loopedPhotos = [];
        //for(var i=0; i<3; i++){
        //    loopedPhotos.push(photos);
        //}

        ////var loopedPhotos = (
        ////    <div>
        ////      {
        ////          for(i=0; i<3; i++){
        ////            (
        ////                <div key={i} style={{position: 'absolute',
        ////                    left: this.scrollPosition + this.state.offset + i*100 }}>
        ////                {photos}
        ////                </div>
        ////            )
        ////          }
        ////      }
        ////    </div>
        ////);


        //return (
        //    <div>
        //      {
        //          loopedPhotos.map((item, index) => (
        //              <div style={{left: this.scrollPosition + this.state.offset + index*100,
        //                           position: 'absolute'}}>
        //                {item}
        //              </div>
        //          ))
        //      }

        //    </div>
        //)
