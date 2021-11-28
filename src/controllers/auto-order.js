"use strict";

const path = require("path");
const { BrowserWindow, Menu, app } = require("electron");
const Common = require("../utils/common");
if (!app.isPackaged) {
  console.log("kaifa");
} else {
  console.log("shengchan");
}
const loadPath =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080/#/quantitative-transaction"
    : `file://${__dirname}/#/quantitative-transaction/index.html`;

class autoOrderWindow {
  constructor() {
    this.autoOrderWindow = new BrowserWindow({
      width: Common.AUTO.WINDOW_SIZE.width,
      height: Common.AUTO.WINDOW_SIZE.height,
      title: Common.AUTO.TITLE,
      resizable: false,
      center: true,
      show: true,
      useContentSize: true,
      frame: false,
      autoHideMenuBar: true,
      maximizable: false,
      alwaysOnTop: false,
      icon: "assets/icon.png",
      titleBarStyle: "hidden",
      webPreferences: {
        contextIsolation: true,
        preload: path.resolve(__dirname, "../preload.js"),
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        enableRemoteModule: true,
        skipTaskbar: false,
      },
    });

    this.autoOrderWindow.loadURL(loadPath);
    this.isShown = false;

    Menu.setApplicationMenu(null);

    // if (process.env.DEBUGGING) {
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
