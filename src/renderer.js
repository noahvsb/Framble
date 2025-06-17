const addressBar = document.getElementById('addressBar');
const renderFrame = document.getElementById('renderFrame');

addressBar.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const url = addressBar.value.trim();
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                renderFrame.srcdoc = `
                    <h1>${response.status}</h1>
                    <p>${response.statusText}</p>
                `;
            } else {
                const html = await response.text();
                renderFrame.srcdoc = html;
            }
        } catch (error) {
            renderFrame.srcdoc = `
                <h1>Error</h1>
                <p>${error.message}</p>
            `;
        }
    }
});