//import React from 'react';

class Countdown {

    constructor(endTime){
        console.log('Countdown', endTime);

        this.timer = setInterval(() => {
            let now = Date.now();
            var msg ='--:--';

            if(endTime){
                const remaining = Math.floor((endTime - now) / 1000);
                const mins = Math.floor(remaining / 60);
                let secs = ""+(remaining % 60);
                if(secs.length == 1) secs = "0"+secs;

                if(remaining >= 0){
                    msg = mins + ":" + secs;
                }

                if(remaining <= 10){
                    msg = "<span style='color: #F00;'>" + msg + "</span>";
                }
            }

            try {
                var timers = document.getElementsByClassName('countdown-timer');
                for(var i=0; i<timers.length; i++){
                    timers[i].innerHTML = msg;
                }
            } catch (err) {
                console.log(err);
                clearInterval(this.timer);
            }

        }, 200);
    }

    deconstruct() {
        clearInterval(this.timer);
    }
}

export default Countdown;
