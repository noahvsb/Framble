const addressBar = document.getElementById('addressBar');
const content = document.getElementById('content');

async function renderPage(url) {
    try {
        content.innerHTML = `
            <h1>Loading...</h1>
        `;

        const response = await fetch(url);
          
        if (!response.ok) {
            content.innerHTML = `
                <h1>${response.status}</h1>
                <p>${response.statusText}</p>
            `;
        } else {
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
        }
    } catch (error) {
        content.innerHTML = `
            <h1>Error</h1>
            <p>${error.message}</p>
        `;
    }
}

addressBar.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const url = addressBar.value.trim();
        
        renderPage(url);
    }
});