"use strict";

const path = require("path");
const { BrowserWindow, Menu, app, ipcMain, ipcRenderer } = require("electron");
const Common = require("../utils/common");
const loadPath = app.isPackaged
  ? `file://${__dirname}/index.html`
  : "http://127.0.0.1:8080/index.html";

const preload = app.isPackaged
  ? path.join(__dirname, "/preload.js")
  : path.resolve(__dirname, "../src/preload.js");

let invitationCode = "";

class mainWindow {
  constructor() {
    this.mainWindow = new BrowserWindow({
      width: Common.MAIN.WINDOW_SIZE.width,
      height: Common.MAIN.WINDOW_SIZE.height,
      title: Common.MAIN.TITLE,
      resizable: false,
      center: true,
      show: false,
      useContentSize: true,
      frame: false,
      autoHideMenuBar: true,
      maximizable: false,
      alwaysOnTop: false,
      icon: "assets/icon.png",
      titleBarStyle: "hidden",
      webPreferences: {
        contextIsolation: true,
        // More info: /quasar-cli/developing-electron-apps/electron-preload-script
        preload: preload,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        enableRemoteModule: true,
        skipTaskbar: false,
      },
    });

    this.mainWindow.loadURL(loadPath);
    this.isShown = false;

    Menu.setApplicationMenu(null);

    this.mainWindow.webContents.openDevTools();
    // if (process.env.DEBUGGING) {
    //   // if on DEV or Production with debug enabled
    //   this.mainWindow.webContents.openDevTools();
    // } else {
    //   // we're on production; no access to devtools pls
    //   this.mainWindow.webContents.on("devtools-opened", () => {
    //     this.mainWindow.webContents.closeDevTools();
    //   });
    // }

    this.mainWindow.on("close", (event) => {
      this.mainWindow.hide();
      this.mainWindow.setSkipTaskbar(true);
      event.preventDefault();
    });
  }

  sendMsg(e, data) {
    this.mainWindow.webContents.send(e, data);
  }

  minimize() {
    this.mainWindow.minimize();
  }

  maximize() {
    this.mainWindow.maximize();
  }

  show() {
    this.mainWindow.show();
    this.isShown = true;
  }

  hide() {
    this.mainWindow.hide();
    this.isShown = false;
  }
}

module.exports = mainWindow;
