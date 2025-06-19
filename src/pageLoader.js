const addressBar = document.getElementById('addressBar');
const content = document.getElementById('content');

function validationCheck(url) {
    try {
        const parsed = new URL(url);

        console.log(parsed);

        // only http(s) allowed
        if (!['http:', 'https:'].includes(parsed.protocol)) return false;

        return true;
    } catch {
        return false;
    }
}

const statusHTML = (header, paragraph, gif) => `
    <div style="padding: 15px">
        <h1>${header}</h1>
        ${paragraph ? `<p>${paragraph}</p>` : ""}
        ${gif ? `<img src="assets/images/sad.gif" alt="sad.gif" style="width:200px; transition: transform 0.5s;">` : ""}
    </div>
`;

async function loadPage(url) {
    if (!validationCheck(url)) {
        content.innerHTML = statusHTML("Invalid url", url, true);
        return;
    }

    try {
        content.innerHTML = statusHTML("Loading..."); // TODO: replace with loading indicator next to address bar

        const response = await fetch(url); // TODO: negotiate content type
          
        if (!response.ok) {
            content.innerHTML = statusHTML(response.status, response.statusText, true);
            return;
        }

        // TODO: check content type

        const webview = document.createElement('webview');
        webview.setAttribute('src', url);
        webview.setAttribute('allowpopups', '');
        webview.setAttribute('id', 'webview');

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
        content.innerHTML = statusHTML("Error", error.message, true);
    }
}

addressBar.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const url = addressBar.value.trim();
        
        loadPage(url);
    }
});