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
        let timeToUse = time * 10;
        if (timeToUse < 1000) {
            let milliseconds = timeToUse;
            if (milliseconds < 1) milliseconds = 1;
            if (milliseconds.toString().length <= 2) milliseconds = milliseconds * 10;
            if (milliseconds.toString().length <= 3) milliseconds = milliseconds * 10;
            let millisecondsToUse = "<span>" + milliseconds.toString()[0] + "</span><span class='smaller-timer-ms'>" + milliseconds.toString()[1] + "" + milliseconds.toString()[2] + "</span>";
            timeToReturn = millisecondsToUse + " ms";
        } else {
            let timeInSeconds = parseInt(timeToUse / 1000);
            let milliseconds = timeToUse - (timeInSeconds * 1000);
            if (milliseconds < 1) milliseconds = 1;
            if (milliseconds.toString().length <= 2) milliseconds = milliseconds * 10;
            if (milliseconds.toString().length <= 3) milliseconds = milliseconds * 10;
            let millisecondsToUse = "<span>" + milliseconds.toString()[0] + "</span><span class='smaller-timer-ms'>" + milliseconds.toString()[1] + "" + milliseconds.toString()[2] + "</span>";
            if (timeInSeconds < 60) timeToReturn = timeInSeconds + " sec " + millisecondsToUse + " ms";
            else if (timeInSeconds < 60 * 60) timeToReturn = (parseInt(timeInSeconds / 60)) + " min " + (timeInSeconds % 60) + " sec " + millisecondsToUse + " ms";
            else if (timeInSeconds < 60 * 60 * 60) timeToReturn = (parseInt(timeInSeconds / (60 * 60))) + " h " + (parseInt(timeInSeconds / (60) - 60 * parseInt(timeInSeconds / (60 * 60)))) + " min " + (timeInSeconds % 60) + " sec " + millisecondsToUse + " ms";
        }
        return timeToReturn;
    }

    stopTime() {
        this.stop = true;
    }
}