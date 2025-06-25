import urlStack from "./modules/urlStack.js";
import loadPage from "./modules/pageLoader.js";

// send renderer log and error events
const { ipcRenderer } = require("electron");

console.log = (...args) => {
    ipcRenderer.send("renderer-log", ...args);
};

console.error = (...args) => {
    ipcRenderer.send("renderer-error", ...args);
};

// back and forward buttons
const webview = document.getElementById("webview");
const backButton = document.getElementById("backButton");
const forwardButton = document.getElementById("forwardButton");

export function updateButtonStates() {
    const isDisabled = urlStack.isEmpty() || webview === undefined;

    backButton.disabled = isDisabled;
    forwardButton.disabled = isDisabled || urlStack.peek() === getUrl();
}

backButton.addEventListener("click", () => {
    
});

forwardButton.addEventListener("click", () => {
    
});

// address bar
const addressBar = document.getElementById("addressBar");

addressBar.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        let url = getUrl();

        // google search when shift + enter is pressed
        if (e.shiftKey) {
            url = googleSearchUrl(url);
            addressBar.value = url;
        }
        
        loadPage(url);
        urlStack.print();
    }
});

function getUrl() {
    return addressBar.value.trim();
}

function googleSearchUrl(url) {
    return `https://google.com/search?q=${url.replaceAll(" ", "+")}`;
}