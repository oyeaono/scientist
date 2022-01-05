"use strict";

const path = require("path");
const { BrowserWindow, Menu, app } = require("electron");
const Common = require("../utils/common");

const loadPath = app.isPackaged
  ? `file://${__dirname}/preemptive-purchase.html`
  : "http://127.0.0.1:8080/preemptive-purchase.html#/preemptive-purchase";

const preload = app.isPackaged
  ? path.join(__dirname, "/preload.js")
  : path.resolve(__dirname, "../src/preload.js");

class preemptivePurchaseWindow {
  constructor() {
    this.preemptivePurchaseWindow = new BrowserWindow({
      width: Common.PREEMPT.WINDOW_SIZE.width,
      height: Common.PREEMPT.WINDOW_SIZE.height,
      title: Common.PREEMPT.TITLE,
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

    this.preemptivePurchaseWindow.loadURL(loadPath);
    this.isShown = false;

    Menu.setApplicationMenu(null);
    // if (!app.isPackaged) {
    //   // if on DEV or Production with debug enabled
    //   this.preemptivePurchaseWindow.webContents.openDevTools();
    // } else {
    //   // we're on production; no access to devtools pls
    //   this.preemptivePurchaseWindow.webContents.on("devtools-opened", () => {
    //     this.preemptivePurchaseWindow.webContents.closeDevTools();
    //   });
    // }

    this.preemptivePurchaseWindow.on("closed", () => {
      this.preemptivePurchaseWindow = null;
    });

    this.preemptivePurchaseWindow.on("ready-to-show", () => {
      let timer = setTimeout(() => {
        this.preemptivePurchaseWindow.webContents.send("PreemptivePurchase", {
          isClose: true,
        });
        clearTimeout(timer);
        timer = null;
      }, 1000);
    });
  }

  sendMsg(e, data) {
    this.preemptivePurchaseWindow.webContents.send(e, data);
  }

  closeWin() {
    this.preemptivePurchaseWindow.close();
  }

  show() {
    this.preemptivePurchaseWindow.show();
    this.isShown = true;
  }

  hide() {
    this.preemptivePurchaseWindow.hide();
    this.isShown = false;
  }
}

module.exports = preemptivePurchaseWindow;
