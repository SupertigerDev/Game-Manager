
const electron = require('electron');
const {
    app,
    BrowserWindow
} = require('electron');
const {
    ipcMain
} = require('electron');
const fs = require('fs');



app.disableHardwareAcceleration()

app.on('ready', () => {
    let win = new BrowserWindow({
        fullscreen: true,
        frame: false
    });
    win.loadURL(`file://${__dirname}/src/main.html`)

});



