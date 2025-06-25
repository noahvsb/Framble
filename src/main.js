const { app, BrowserWindow, ipcMain } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1500,
        height: 900,
        icon: 'assets/images/framble.png',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true
        },
    });

    win.loadFile('index.html');

    win.setMenu(null);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// handle renderer logs and errors
ipcMain.on('renderer-log', (event, ...args) => {
    console.log('[Renderer LOG]', ...args);
});

ipcMain.on('renderer-error', (event, ...args) => {
    console.error('[Renderer ERROR]', ...args);
});
