/***********************
 * message: message to be displayed
 * error: true if it is an error. If error == false then the message will be coloured differently (green instead red)
 * messageFieldID: ID of the HTML element in which the error will be displayed
 * displayTime: the message will be displayed for {displayTime} milliseconds and then will fade out
 * 
 * 
 * operationOutcomeCount counts the number of outcomes that have occured in the last {displayTime} milliseconds. It allows to decide whether to remove or not the HTML element from the screen (the timer of an event triggered 2.5 seconds ago shouldn't hide the outcome of another event that has just happened!)
 */

let operationOutcomeCount = 0;

function displayOperationOutcome(message, error, messageFieldID, displayTime){
    // the message is rendered on the screen
    let messageBox = document.getElementById(messageFieldID);
    messageBox.innerText = message;
    messageBox.classList.remove('invisible');
    
    // the outcome of a new operation is currently displayed. It has already overridden the content of the previous operation,
    // if there was one, but we must keep track of the number of operation outcome in order to decide whether activating or not the 
    // fade-out...
    operationOutcomeCount++;
    //console.log(operationOutcomeCount);
    setTimeout(()=>{
        if(operationOutcomeCount==1){ //Only if the outcome is just one we can make it disappear after {displayTime}
            //after 3 seconds we make the message disappear
            messageBox.classList.add('fade-out');
            operationOutcomeCount--;

            setTimeout(()=>{
                //after the fade-out animation is ended we recover the original state of the HTML element (no text, invisible class applied)
                messageBox.innerText='';
                messageBox.classList.add('invisible');
                messageBox.classList.remove('fade-out');
            }, 500);
        }
        else{   //if we have more outcomes we just reduce the number of them by one (as one outcome is ended, but another event could have triggered an outcome in the last {displayTime} milliseconds)
            operationOutcomeCount--;
        }
        //console.log('inside', operationOutcomeCount);

    }, displayTime);
    
    if(!error)
        messageBox.classList.add('success');
    else
    messageBox.classList.remove('success');
}