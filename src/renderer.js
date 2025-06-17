const addressBar = document.getElementById('addressBar');
const renderFrame = document.getElementById('renderFrame');

addressBar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const input = addressBar.value.trim();
        renderFrame.srcdoc = `${input}`;
    }
});