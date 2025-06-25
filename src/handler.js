import loadPage from "./modules/pageLoader.js";

// send renderer log and error events
const { ipcRenderer } = require('electron');

console.log = (...args) => {
    ipcRenderer.send('renderer-log', ...args);
};

console.error = (...args) => {
    ipcRenderer.send('renderer-error', ...args);
};

// todo: back and forward buttons
// use URLStack.empty() and URLStack.peek() to disable/enable the buttons, then handle navigation
document.getElementById('backButton').addEventListener('click', () => {

});

document.getElementById('forwardButton').addEventListener('click', () => {

});

// address bar
document.getElementById("addressBar").addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        let url = addressBar.value.trim();

        // google search when shift + enter is pressed
        if (e.shiftKey) {
            url = googleSearchUrl(url);
            addressBar.value = url;
        }
        
        loadPage(url);
    }
});

function googleSearchUrl(url) {
    return `https://google.com/search?q=${url.replaceAll(" ", "+")}`;
}