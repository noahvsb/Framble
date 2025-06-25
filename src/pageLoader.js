const { ipcRenderer } = require('electron');

console.log = (...args) => {
    ipcRenderer.send('renderer-log', ...args);
};

console.error = (...args) => {
    ipcRenderer.send('renderer-error', ...args);
};

const addressBar = document.getElementById("addressBar");
const content = document.getElementById("content");
const loadingSpinner = document.getElementById('loadingSpinner');

function showLoadingSpinner() {
    loadingSpinner.style.visibility = 'visible';
}

function hideLoadingSpinner() {
    loadingSpinner.style.visibility = 'hidden';
}

function validationCheck(url) {
    console.log(`validation check on: ${url}`);
    try {
        const parsed = new URL(url);

        // only http(s) allowed
        if (!["http:", "https:"].includes(parsed.protocol)) {
            console.log("validation failed: not a http(s) protocol");
            return false;
        }

        // check if hostname includes a dot (.)
        if (!parsed.hostname.includes('.')) {
            console.log("validation failed: hostname missing dot (.)");
            return false;
        }
        
        console.log("validation success");
        return true;
    } catch {
        console.log("validation failed: url parsing error");
        return false;
    }
}

function setStatusMessage(header, paragraph, gif) {
    const paddedWrapper = document.createElement("div");
    paddedWrapper.style.padding = "20px";

    const headerElement = document.createElement("h1");
    headerElement.textContent = header;

    paddedWrapper.appendChild(headerElement);

    if (paragraph) {
        const paragraphElement = document.createElement("p");
        paragraphElement.textContent = paragraph;

        paddedWrapper.appendChild(paragraphElement);
    }

    if (gif) {
        const gifElement = document.createElement("img");
        gifElement.setAttribute("src", "assets/images/sad.gif");
        gifElement.setAttribute("alt", "sad.gif");
        gifElement.style.width = "200px";

        paddedWrapper.appendChild(gifElement);
    }

    content.innerHTML = "";
    content.appendChild(paddedWrapper);
}

async function loadPage(url) {
    if (!validationCheck(url)) {
        // TODO: give option to search with google (https://www.google.com/search?q=${url})

        // check if adding https:// fixes it (http not supported in this way)
        if (validationCheck(`https://${url}`)) {
            url = `https://${url}`;
        } else {
            setStatusMessage("Invalid url", url, true);
            return;
        }
    }

    try {
        showLoadingSpinner();
        const response = await fetch(url); // TODO: negotiate content type
        hideLoadingSpinner();
          
        if (!response.ok) {
            setStatusMessage(response.status, response.statusText, true);
            return;
        }

        // TODO: check content type

        const webview = document.createElement("webview");
        webview.setAttribute("src", url);
        webview.setAttribute("allowpopups", true);
        webview.style.flex = "1";
        webview.style.display = "flex";

        content.innerHTML = ''; // clear loading
        content.appendChild(webview);

        webview.addEventListener('will-navigate', (e) => {
            e.preventDefault();
            addressBar.value = e.url;
            loadPage(e.url);
        });

        webview.addEventListener('new-window', (e) => {
            e.preventDefault();
            addressBar.value = e.url;
            loadPage(e.url);
        });
    } catch (error) {
        hideLoadingSpinner();
        setStatusMessage("Error", error.message, true);
    }
}

addressBar.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const url = addressBar.value.trim();
        
        loadPage(url);
    }
});