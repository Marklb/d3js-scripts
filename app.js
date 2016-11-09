'use babel';

const fs = require('fs-extra');
// console.log(fs);

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const ipcMain = electron.ipcMain;


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
// var mainWindow2 = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    autoHideMenuBar: true,
    show: false,
    // alwaysOnTop: true,
    // fullscreen: true,
    // frame: false,
    // transparent: true
  });
  // mainWindow.setIgnoreMouseEvents(true);

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/src/index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // ${DEBUG_PREFIX}-lowlevelkeyboard-set-window-id
  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.show();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.

    mainWindow = null;
    // let wins = BrowserWindow.getAllWindows();
    // for(let i = 0; i < wins.length; i++){
    //   wins[i].close();
    // }
  });
  // global.mainWindow = mainWindow;






});
