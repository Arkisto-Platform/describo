"use strict";

import { app, BrowserWindow, dialog } from "electron";
import * as path from "path";
import { format as formatUrl } from "url";
import { autoUpdater } from "electron-updater";

const isDevelopment = process.env.NODE_ENV !== "production";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

function createMainWindow() {
    const window = new BrowserWindow({
        width: 1300,
        height: 1100,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            webSecurity: process.env.NODE_ENV !== "development",
            enableRemoteModule: true,
        },
    });
    window.webContents.session.clearCache(() => {});

    if (isDevelopment) {
        window.webContents.openDevTools();
        window.loadURL(
            `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
        );
    } else {
        window.loadURL(
            formatUrl({
                pathname: path.join(__dirname, "index.html"),
                protocol: "file",
                slashes: true,
            })
        );
    }

    window.on("close", (e) => {
        const answer = dialog.showMessageBoxSync({
            type: "question",
            buttons: ["cancel", "OK"],
            message: "Are you sure you want to close describo?",
        });
        if (!answer) {
            return e.preventDefault();
        }
    });
    window.on("closed", () => {
        app.exit();
    });

    autoUpdater.on("update-downloaded", onUpdateDownloaded);
    autoUpdater.checkForUpdatesAndNotify();

    return window;
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        mainWindow = createMainWindow();
    }
});

// create main BrowserWindow when electron is ready
app.on("ready", () => {
    mainWindow = createMainWindow();
});

function onUpdateDownloaded() {
    let buttonPressed = dialog.showMessageBox({
        type: "info",
        buttons: ["Got it!"],
        defaultId: 0,
        title: "Update Available",
        message: `A new version of the application is available. It will be installed the next time you restart Describo!.`,
    });
}
