const loadingSpinner = document.getElementById('loadingSpinner');

export function showLoadingSpinner() {
    loadingSpinner.style.visibility = 'visible';
}

export function hideLoadingSpinner() {
    loadingSpinner.style.visibility = 'hidden';
}