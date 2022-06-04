let score = new Score();
let text = new Text();
let page = new Page();

// We need to wait until the text is fetched from the backend before we try to print it to the page 
text.loadText()
    .then(() => {
        page.printOriginalText();
        text.readArrayDOM();
    })
    .catch(e => {
        // There is a problem in loading the text from the backend => remove the user interface and stop the game
        document.getElementById('originalText').textContent = 'Non sono disponibili testi :(';
        updateCounter(page.timer, true);
        document.getElementById('inputField').remove();
        document.getElementById('timer').remove();
        document.getElementById('buttons').remove();
    });