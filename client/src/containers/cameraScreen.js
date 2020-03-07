import React, { Component } from 'react';
import Webcam from 'react-webcam';

import '../css/camera.css';

class CameraScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {photo: null};
        this.takePhoto = this.takePhoto.bind(this);
        this.cancelPhoto = this.cancelPhoto.bind(this);
        this.sendPhoto = this.sendPhoto.bind(this);
    }

    componentDidMount() {
        // get handle to the canvas that draws the taken image, and make invisible...
        //this.ctx = this.canvas.getContext("2d");
    }

    takePhoto() {
        const photo = this.webcam.getScreenshot();

        var ctx = this.canvas.getContext("2d");
        const width = this.canvas.width,
              height = this.canvas.height;

        var image = new Image();
        image.onload = () => {
            var w = image.width,
                h = image.height

            ctx.drawImage(image, 0, 0, width, height);
        }
        image.src = photo;

        this.setState({ photo });
        // TODO: start "flash" animation...
    }

    cancelPhoto() {
        console.log('cancelPhoto');
        var ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.setState({ photo: null });
    }

    sendPhoto() {
        // TODO
        console.log('sendPhoto');
        alert('Not implemented yet ;)');
    }

    render() {
        const videoConstraints = {
            facingMode: 'environment'
        };

        let cameraButtons = null;
        if (this.state.photo) {
            cameraButtons = (
                    <div>
                    <button style={{width: '50%'}} onClick={this.cancelPhoto}>Cancel</button>
                    <button style={{width: '50%'}} onClick={this.sendPhoto}>Send</button>
                    </div>
            )
        } else {
            cameraButtons = (
                    <div>
                        <button style={{width: '50%'}} onClick={this.takePhoto}>Take</button>
                    </div>
            )
        }

        return (
            <div>
                <div id="videoview">
                <canvas id="overlay" ref={node => this.canvas = node} />
                <Webcam audio={false}
                    ref={node => this.webcam = node}
                    videoConstraints={videoConstraints}
                    screenshotFormat="image/jpeg"
                    forceScreenshotSourceSize={false}
                    screenshotQuality="1.0"
                    imageSmoothing={false}
            onUserMediaError={(e)=>{alert('Error loading camera')}}
            onUserMedia={()=>{console.log('Camera loaded')}}
                    style={{height: "100vh", width: "100vw", objectFit: "cover", position: "absolute"}}/>
                </div>
                <div id="photoButtonContainer">
                    {cameraButtons}
                </div>
            </div>
        );
    }

}

export default CameraScreen;
