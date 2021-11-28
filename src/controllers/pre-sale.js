"use strict";

const path = require("path");
const { BrowserWindow, Menu, app } = require("electron");
const Common = require("../utils/common");

const loadPath =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8081/#/preemptive-pre-sale"
    : `file://${__dirname}/#/preemptive-pre-sale/index.html`;

class preSaleWindow {
  constructor() {
    this.preSaleWindow = new BrowserWindow({
      width: Common.PREEMPTPRESALE.WINDOW_SIZE.width,
      height: Common.PREEMPTPRESALE.WINDOW_SIZE.height,
      title: Common.PREEMPTPRESALE.TITLE,
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

    this.preSaleWindow.loadURL(loadPath);
    this.isShown = false;

    Menu.setApplicationMenu(null);

    // if (process.env.DEBUGGING) {
    //   // if on DEV or Production with debug enabled
    //   this.preSaleWindow.webContents.openDevTools();
    // } else {
    //   // we're on production; no access to devtools pls
    //   this.preSaleWindow.webContents.on("devtools-opened", () => {
    //     this.preSaleWindow.webContents.closeDevTools();
    //   });
    // }

    this.preSaleWindow.on("closed", () => {
      this.preSaleWindow = null;
    });

    this.preSaleWindow.on("ready-to-show", () => {
      let timer = setTimeout(() => {
        this.preSaleWindow.webContents.send("PreSale", { isClose: true });
        clearTimeout(timer);
        timer = null;
      }, 1000);
    });
  }

  sendMsg(e, data) {
    this.preSaleWindow.webContents.send(e, data);
  }

  closeWin() {
    this.preSaleWindow.close();
  }

  show() {
    this.preSaleWindow.show();
    this.isShown = true;
  }

  hide() {
    this.preSaleWindow.hide();
    this.isShown = false;
  }
}

module.exports = preSaleWindow;
