const addressBar = document.getElementById('addressBar');
const content = document.getElementById('content');

function validationCheck(url) {
    try {
        const parsed = new URL(url);

        // only http(s) allowed
        if (!['http:', 'https:'].includes(parsed.protocol)) return false;

        return true;
    } catch (error) {
        return false;
    }
}

async function renderPage(url) {
    if (!validationCheck(url)) {
        content.innerHTML = `
            <h1>Invalid url</h1>
            <p>${url}</p>
            <img src="assets/images/sad.gif" alt="sad.gif" style="width:200px; transition: transform 0.5s;">
        `;
        return;
    }

    try {
        content.innerHTML = `
            <h1>Loading...</h1>
        `;

        const response = await fetch(url);
          
        if (!response.ok) {
            content.innerHTML = `
                <h1>${response.status}</h1>
                <p>${response.statusText}</p>
                <img src="assets/images/sad.gif" alt="sad.gif" style="width:200px; transition: transform 0.5s;">
            `;
            return;
        } 

        const html = await response.text();

        content.innerHTML = html;

        // handle hyperlinks
        content.querySelectorAll('a').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const href = anchor.getAttribute('href');
                if (href && !href.startsWith('javascript:')) {
                    const newUrl = new URL(href, url).toString();
                    addressBar.value = newUrl;
                    renderPage(newUrl);
                }
            });
        });
    } catch (error) {
        content.innerHTML = `
            <h1>Error</h1>
            <p>${error.message}</p>
            <img src="assets/images/sad.gif" alt="sad.gif" style="width:200px; transition: transform 0.5s;">
        `;
    }
}

addressBar.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const url = addressBar.value.trim();
        
        renderPage(url);
    }
});