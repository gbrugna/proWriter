class Text {
    constructor() {
        //carica testo dal db
        this.original = "Testo di prova";
        this.originalArray = this.original.split(' ');
    }

    formatOriginalText() {
        let output = '';
        let i = 0;
        this.originalArray.forEach(word => {
            output += `<span id="word${i}">${word}</span> `;
            i++
        });
        return output;
    }
}