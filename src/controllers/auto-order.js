"use strict";

const path = require("path");
const { BrowserWindow, Menu, app } = require("electron");
const Common = require("../utils/common");

const loadPath = app.isPackaged
  ? `file://${__dirname}/quantitative-transaction.html`
  : "http://127.0.0.1:8080/quantitative-transaction.html#/quantitative-transaction";

const preload = app.isPackaged
  ? path.join(__dirname, "/preload.js")
  : path.resolve(__dirname, "../src/preload.js");

class autoOrderWindow {
  constructor() {
    this.autoOrderWindow = new BrowserWindow({
      width: Common.AUTO.WINDOW_SIZE.width,
      height: Common.AUTO.WINDOW_SIZE.height,
      title: Common.AUTO.TITLE,
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
        preload: preload,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        enableRemoteModule: true,
        skipTaskbar: false,
      },
    });

    this.autoOrderWindow.loadURL(loadPath);
    this.isShown = false;

    Menu.setApplicationMenu(null);
    // if (!app.isPackaged) {
    //   // if on DEV or Production with debug enabled
    //   this.autoOrderWindow.webContents.openDevTools();
    // } else {
    //   // we're on production; no access to devtools pls
    //   this.autoOrderWindow.webContents.on("devtools-opened", () => {
    //     this.autoOrderWindow.webContents.closeDevTools();
    //   });
    // }

    this.autoOrderWindow.on("closed", () => {
      this.autoOrderWindow = null;
    });

    this.autoOrderWindow.on("ready-to-show", () => {
      let timer = setTimeout(() => {
        this.autoOrderWindow.webContents.send("QuantitativeTransaction", {
          isClose: true,
        });
        clearTimeout(timer);
        timer = null;
      }, 1000);
    });
  }

  sendMsg(e, data) {
    this.autoOrderWindow.webContents.send(e, data);
  }

  closeWin() {
    this.autoOrderWindow.close();
  }

  show() {
    this.autoOrderWindow.show();
    this.isShown = true;
  }

  hide() {
    this.autoOrderWindow.hide();
    this.isShown = false;
  }
}

module.exports = autoOrderWindow;
