class Counter {
    constructor() {
        this.timer = 0;
        this.stop = false;
    }

    start() {
        this.stop = false;
        document.getElementById("wpm").innerHTML = this.getFormattedTime(this.timer);
    }

    increment() {
        if (!this.stop) {
            this.timer++;
            document.getElementById("wpm").innerHTML = this.getFormattedTime(this.timer);
        }
    }

    getFormattedTime(time) {
        //return the time formatted as "X sec" or "X min Y sec" or "X h Y min Z sec"
        let timeToReturn = "0 sec";
        if (time < 60) timeToReturn = time + " sec";
        else if (time < 60 * 60) timeToReturn = (parseInt(time / 60)) + " min " + (time % 60) + " sec"
        else if (time < 60 * 60 * 60) timeToReturn = (parseInt(time / (60 * 60))) + " h " + (parseInt(time / (60) - 60 * parseInt(time / (60 * 60)))) + " min " + (time % 60) + " sec";
        return timeToReturn;
    }

    stop() {
        this.stop = true;
    }
}