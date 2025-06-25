import urlStack from "./urlStack.js";
import validationCheck from "./validationCheck.js";
import { showLoadingSpinner, hideLoadingSpinner } from "./loadingSpinner.js";
import { updateButtonStates } from "../handler.js";

const addressBar = document.getElementById("addressBar");
const content = document.getElementById("content");

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

export async function loadPage(url) {
    if (!validationCheck(url)) {
        // check if adding https:// fixes it (http not supported in this way)
        if (validationCheck(`https://${url}`)) {
            url = `https://${url}`;
        } else {
            setStatusMessage("Invalid url", url, true);
            updateButtonStates();
            return;
        }
    }

    try {
        showLoadingSpinner();
        const response = await fetch(url); // TODO: negotiate content type
        hideLoadingSpinner();
          
        if (!response.ok) {
            setStatusMessage(response.status, response.statusText, true);
            updateButtonStates();
            return;
        }

        // TODO: check content type

        const webview = document.createElement("webview");
        webview.setAttribute("id", "webview");
        webview.setAttribute("src", url);
        webview.setAttribute("allowpopups", true);
        webview.style.flex = "1";
        webview.style.display = "flex";

        content.innerHTML = ''; // clear loading
        content.appendChild(webview);

        webview.addEventListener('will-navigate', (e) => {
            e.preventDefault();
            addressBar.value = e.url;
            pushAndLoadPage(e.url);
        });

        webview.addEventListener('new-window', (e) => {
            e.preventDefault();
            addressBar.value = e.url;
            pushAndLoadPage(e.url);
        });
    } catch (error) {
        hideLoadingSpinner();
        setStatusMessage("Error", error.message, true);
    }

    updateButtonStates();
}

export function pushAndLoadPage(url) {
    urlStack.push(url);
    urlStack.print(url);
    loadPage(url);
}
