"use strict";

const path = require("path");
const { BrowserWindow, Menu, app, protocol, ipcMain } = require("electron");
const Common = require("../utils/common");
const loadPath = app.isPackaged
  ? `file://${__dirname}/invitation-code.html`
  : "http://127.0.0.1:8080/invitation-code.html#/invitation-code";

const preload = app.isPackaged
  ? path.join(__dirname, "/preload.js")
  : path.resolve(__dirname, "../src/preload.js");

class invitationCodeWindow {
  constructor() {
    this.invitationCodeWindow = new BrowserWindow({
      width: Common.INVITATIONCODE.WINDOW_SIZE.width,
      height: Common.INVITATIONCODE.WINDOW_SIZE.height,
      title: Common.INVITATIONCODE.TITLE,
      useContentSize: true,
      show: false,
      maximizable: false, // 禁止双击放大
      frame: false, // 去掉顶部操作栏
      transparent: true,
      resizable: false,
      center: true,
      autoHideMenuBar: true,
      alwaysOnTop: true,
      icon: "assets/icon.png",
      titleBarStyle: "hidden",
      webPreferences: {
        contextIsolation: true,
        preload: preload,
        enableRemoteModule: true,
        nodeIntegration: true,
        skipTaskbar: false,
        nodeIntegrationInWorker: true,
      },
    });

    this.invitationCodeWindow.loadURL(loadPath);
    this.isShown = false;

    Menu.setApplicationMenu(null);

    this.invitationCodeWindow.webContents.openDevTools();

    this.invitationCodeWindow.on("closed", () => {
      this.invitationCodeWindow = null;
    });

    // if (process.env.DEBUGGING) {
    //   // if on DEV or Production with debug enabled
    //   this.invitationCodeWindow.webContents.openDevTools();
    // } else {
    //   // we're on production; no access to devtools pls
    //   this.invitationCodeWindow.webContents.on("devtools-opened", () => {
    //     this.invitationCodeWindow.webContents.closeDevTools();
    //   });
    // }
  }

  closeWin() {
    this.invitationCodeWindow.close();
  }

  show() {
    this.invitationCodeWindow.show();
    this.isShown = true;
  }

  hide() {
    this.invitationCodeWindow.hide();
    this.isShown = false;
  }
}

module.exports = invitationCodeWindow;
