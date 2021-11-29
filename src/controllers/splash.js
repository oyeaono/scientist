"use strict";

const path = require("path");
const { BrowserWindow, Menu, app } = require("electron");
const Common = require("../utils/common");
const loadPath = app.isPackaged
  ? `file://${__dirname}/splash.html`
  : "http://127.0.0.1:8080/splash.html#/splash";

const preload = app.isPackaged
  ? path.join(__dirname, "/preload.js")
  : path.resolve(__dirname, "../src/preload.js");

class SplashWindow {
  constructor() {
    this.splashWindow = new BrowserWindow({
      width: Common.LOADING.WINDOW_SIZE.width,
      height: Common.LOADING.WINDOW_SIZE.height,
      useContentSize: true,
      show: true,
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

    this.splashWindow.loadURL(loadPath);
    this.isShown = false;

    Menu.setApplicationMenu(null);

    // if (!app.isPackaged) {
    //   // if on DEV or Production with debug enabled
    //   this.splashWindow.webContents.openDevTools();
    // } else {
    //   // we're on production; no access to devtools pls
    //   this.splashWindow.webContents.on("devtools-opened", () => {
    //     this.splashWindow.webContents.closeDevTools();
    //   });
    // }

    this.splashWindow.on("closed", () => {
      this.splashWindow = null;
    });
  }

  closeWin() {
    this.splashWindow.close();
  }

  show() {
    this.splashWindow.show();
    this.isShown = true;
  }

  hide() {
    this.splashWindow.hide();
    this.isShown = false;
  }
}

module.exports = SplashWindow;
