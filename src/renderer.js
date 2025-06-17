const input = document.getElementById('urlInput');
const content = document.getElementById('content');

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        content.textContent = input.value;
    }
});