class Counter {
    constructor() {
        this.timer = 0;
        this.stop = true;
    }

    start() {
        this.stop = false;
        document.getElementById("timer").innerHTML = this.getFormattedTime(this.timer);
    }

    increment() {
        if (!this.stop) {
            this.timer++;
            document.getElementById("timer").innerHTML = this.getFormattedTime(this.timer);
        }
    }

    getTime() {
        return this.timer;
    }

    getFormattedTime(time) {
        //return the time formatted as "X sec" or "X min Y sec" or "X h Y min Z sec"
        let timeToReturn = "0 ms";
        if (time < 100) timeToReturn = time + "ms"
        else {
            let timeInSeconds = parseInt(time / 100);
            let milliseconds = time - (timeInSeconds * 100);
            if (timeInSeconds < 60) timeToReturn = timeInSeconds + " sec " + milliseconds + " ms";
            else if (timeInSeconds < 60 * 60) timeToReturn = (parseInt(timeInSeconds / 60)) + " min " + (timeInSeconds % 60) + " sec " + milliseconds + " ms";
            else if (timeInSeconds < 60 * 60 * 60) timeToReturn = (parseInt(timeInSeconds / (60 * 60))) + " h " + (parseInt(timeInSeconds / (60) - 60 * parseInt(timeInSeconds / (60 * 60)))) + " min " + (timeInSeconds % 60) + " sec " + milliseconds + " ms";
        }
        return timeToReturn;
    }

    stopTime() {
        this.stop = true;
    }
}