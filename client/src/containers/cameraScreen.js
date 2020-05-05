import React, { Component } from 'react';
import Div100vh from 'react-div-100vh';

import '../css/camera.css';
import style from '../css/style.module.css';

class CameraScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {photo: null,
                      facingMode: 'environment'};

        this.takePhoto = this.takePhoto.bind(this);
        this.cancelPhoto = this.cancelPhoto.bind(this);
        this.sendPhoto = this.sendPhoto.bind(this);
        this.animate = this.animate.bind(this);
        this.flipCamera = this.flipCamera.bind(this);

    }

    componentDidMount() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.video.setAttribute('autoplay', '');
        this.video.setAttribute('muted', '');
        this.video.setAttribute('playsinline', '');

        var ctx = this.canvas.getContext("2d");
        ctx.globalAlpha = 0.0;

        this.setCamera('environment');
    }

    flashAnimation(ctx, width, height, photoData, progress) {
        // fade the white fill...
        ctx.clearRect(0, 0, width, height);
        ctx.putImageData(photoData, 0, 0);
        ctx.fillStyle = "rgba(255, 255, 255, " + (1-progress) + ")";
        ctx.fillRect(0, 0, width, height);
    }

    cancelPhotoAnimation(ctx, width, height, photoData, progress) {
        // move the image...
        ctx.clearRect(0, 0, width, height);

        // set image alpha...
        const length = photoData.data.length;
        const alpha = 255 * (1-progress);

        for(var i=3; i < length; i+=4){
            photoData.data[i] = alpha;
        }

        ctx.putImageData(photoData, 0, progress*(height/2));
    }

    sendPhotoAnimation(ctx, width, height, photoData, progress) {
        // send the image...
        ctx.clearRect(0, 0, width, height);
        ctx.putImageData(photoData, progress*width, 0);
    }

    animate(animation, duration) {
        var start = new Date().getTime();
        var end = start + duration;

        // compatibility...
        var requestAnimationFrame =
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                function(callback) {
                    return setTimeout(callback, 10);
                };

        var ctx = this.canvas.getContext("2d");
        const width = this.canvas.width;
        const height = this.canvas.height;
        const photoData = ctx.getImageData(0, 0, width, height);

        var step = function() {
            var timeStamp = new Date().getTime();
            var progress = Math.min((duration - (end - timeStamp)) / duration, 1);

            animation(ctx, width, height, photoData, progress);

            if (progress < 1) requestAnimationFrame(step);
        };

        return step();
    }

    takePhoto() {
        var ctx = this.canvas.getContext("2d");
        ctx.globalAlpha = 1.0;

        // only see the right portion of the screen, so need to crop this part
        const ratio = this.canvas.width/this.canvas.height;
        const cropWidth = this.video.videoHeight * ratio;
        const cropX = this.video.videoWidth - cropWidth;

        ctx.drawImage(this.video, cropX, 0, cropWidth, this.video.videoHeight, 0, 0, this.canvas.width, this.canvas.height);

        const photo = this.canvas.toDataURL('image/webp');

        this.setState({ photo });
        this.animate(this.flashAnimation, 500);
    }

    flipCamera() {
        console.log('flipCamera');
        if(this.state.facingMode === 'environment'){
            this.setState({facingMode: 'user'});
            this.setCamera('user');
        } else {
            this.setState({facingMode: 'environment'});
            this.setCamera('environment');
        }
    }

    setCamera(facingMode) {
        console.log('setCamera', facingMode);
        if(this.video.srcObject){
            this.video.srcObject.getTracks()[0].stop();
        } else {
            this.video.srcObject = null;
        }
        navigator.mediaDevices.getUserMedia({video: {facingMode: facingMode}})
            .then((stream) => {
                this.video.srcObject = stream;
                this.video.play();
            });
    }

    cancelPhoto() {
        this.setState({ photo: null });
        this.animate(this.cancelPhotoAnimation, 300);
    }

    sendPhoto() {
        // TODO
        this.animate(this.sendPhotoAnimation, 300);

        alert('Not implemented yet ;)');
    }

    render() {
        let cameraButtons = null;
        if (this.state.photo) {
            cameraButtons = (
                    <div id="photoButtonContainer">
                    <button className={style.btnarrow} onClick={this.cancelPhoto}></button>
                    <button className={style.btnyes} onClick={this.sendPhoto}></button>
                    </div>
            )
        } else {
            cameraButtons = (
                    <div id="photoButtonContainer">
                    <button className={style.btnarrow}></button>
                    <button className={style.btncapture} onClick={this.takePhoto}></button>
                    <button className={style.btnflip} onClick={this.flipCamera}></button>
                    </div>
            )
        }

        return (
            <Div100vh>
                <video id="videoview" ref={node => this.video = node} autoPlay />
                <canvas id="videocanvas" ref={node => this.canvas = node} />
                {cameraButtons}
            </Div100vh>
        );
    }

}

export default CameraScreen;
