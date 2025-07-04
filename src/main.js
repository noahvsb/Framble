const { app, BrowserWindow, ipcMain, session } = require("electron");
const { ElectronBlocker } = require("@ghostery/adblocker-electron");
const fetch = require("electron-fetch").default;
// const shortUrl = require("./modules/shortUrl.js").default;

async function createWindow() {
    // adblocker
    const blocker = await ElectronBlocker.fromPrebuiltAdsAndTracking(fetch);
    blocker.enableBlockingInSession(session.defaultSession);

    // log
    // blocker.on("request-blocked", (request) => {
    //     console.log("[LOG] Blocked:", shortUrl(request.url));
    // });

    // browser window
    const win = new BrowserWindow({
        width: 1500,
        height: 900,
        icon: "assets/images/framble.png",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true
        },
    });

    win.loadFile("index.html");

    win.setMenu(null);

    return win;
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

// handle renderer log and error events
ipcMain.on("renderer-log", (_event, ...args) => {
    console.log("[Renderer LOG]", ...args);
});

ipcMain.on("renderer-error", (_event, ...args) => {
    console.error("[Renderer ERROR]", ...args);
});
