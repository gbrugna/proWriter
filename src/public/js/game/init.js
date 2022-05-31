let score = new Score();
let text = new Text();
let page = new Page();

// We need to wait until the text is fetched from the backend before we try to print it to the page 
text.loadText()
.then(()=>{
    page.printOriginalText();
    text.readArrayDOM();
});