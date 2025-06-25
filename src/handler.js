import urlStack from "./modules/urlStack.js";
import { loadPage, pushAndLoadPage } from "./modules/pageLoader.js";

// send renderer log and error events
const { ipcRenderer } = require("electron");

console.log = (...args) => {
    ipcRenderer.send("renderer-log", ...args);
};

console.error = (...args) => {
    ipcRenderer.send("renderer-error", ...args);
};

// back and forward buttons
const backButton = document.getElementById("backButton");
const forwardButton = document.getElementById("forwardButton");

export function updateButtonStates() {
    backButton.disabled = !urlStack.canGoBack();
    forwardButton.disabled = !urlStack.canGoForward();
}

backButton.addEventListener("click", () => {
    const url = urlStack.goBack();
    addressBar.value = url;
    urlStack.print();
    loadPage(url);
});

forwardButton.addEventListener("click", () => {
    const url = urlStack.goForward();
    addressBar.value = url;
    urlStack.print();
    loadPage(url);
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
        
        pushAndLoadPage(url);
    }
});

function getUrl() {
    return addressBar.value.trim();
}

function googleSearchUrl(url) {
    return `https://google.com/search?q=${url.replaceAll(" ", "+")}`;
}