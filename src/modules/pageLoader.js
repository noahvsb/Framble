import urlStack from "./urlStack.js";
import validationCheck from "./validationCheck.js";
import { showLoadingSpinner, hideLoadingSpinner } from "./loadingSpinner.js";
import { updateButtonStates } from "../handler.js";

const addressBar = document.getElementById("addressBar");
const contentTypeSelect = document.getElementById("contentTypeSelect");
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

    content.replaceChildren(paddedWrapper);
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
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": contentTypeSelect.value
            }
        });
          
        if (!response.ok) {
            console.log("fetch failed: status code", response.status);
            setStatusMessage(response.status, response.statusText, true);
            updateButtonStates();
            return;
        }
        
        console.log("fetch success");

        const contentType = response.headers.get("Content-Type");

        console.log("Content-Type:", contentType);

        if (!contentType) {
            setStatusMessage("No content type provided", "This website sucks");
            updateButtonStates();
            return;
        }

        if (contentType.includes("text/html")) {
            // TODO: reuse webview and set display: none when not using it
            const webview = document.createElement("webview");
            webview.setAttribute("id", "webview");
            webview.setAttribute("src", url);
            webview.style.flex = "1";
            webview.style.display = "flex";

            content.replaceChildren(webview);

            webview.addEventListener('will-navigate', (e) => {
                e.preventDefault();
                addressBar.value = e.url;
                pushAndLoadPage(e.url);
            }, { once: true });

            webview.addEventListener('new-window', (e) => {
                e.preventDefault();
                addressBar.value = e.url;
                pushAndLoadPage(e.url);
            }, { once: true });

            webview.addEventListener('did-finish-load', () => {
                hideLoadingSpinner();

                // remove all target="_blank" attributes from <a> elements
                webview.executeJavaScript(`document.querySelectorAll('a[target="_blank"]').forEach(link => link.removeAttribute("target"));`);
            }, { once: true });
        } else if (contentType.includes("application/json")) {
            const json = await response.json();

            const pre = document.createElement("pre");
            pre.textContent = JSON.stringify(json, null, 2);
            pre.style.overflow = "auto";
            pre.style.fontFamily = "monospace";
            pre.style.whiteSpace = "pre-wrap";

            content.replaceChildren(pre);

            hideLoadingSpinner();
        }
    } catch (error) {
        console.log("fetch failed: error");
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
