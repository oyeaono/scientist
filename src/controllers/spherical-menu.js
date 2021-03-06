"use strict";

const path = require("path");
const { BrowserWindow, Menu, app } = require("electron");
const Common = require("../utils/common");

const loadPath = app.isPackaged
  ? `file://${__dirname}/spherical-menu.html`
  : "http://127.0.0.1:8080/spherical-menu.html#/spherical-menu";

const preload = app.isPackaged
  ? path.join(__dirname, "/preload.js")
  : path.resolve(__dirname, "../src/preload.js");

class sphericalMenuWindow {
  constructor() {
    this.sphericalMenu = new BrowserWindow({
      width: Common.SPHERICALMENU.WINDOW_SIZE.width,
      height: Common.SPHERICALMENU.WINDOW_SIZE.height,
      title: Common.SPHERICALMENU.TITLE,
      resizable: false,
      center: true,
      show: true,
      useContentSize: true,
      frame: false,
      autoHideMenuBar: true,
      transparent: true,
      maximizable: false,
      alwaysOnTop: true,
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

    this.sphericalMenu.loadURL(loadPath);
    this.isShown = false;

    Menu.setApplicationMenu(null);

    // if (!app.isPackaged) {
    //   // if on DEV or Production with debug enabled
    //   this.sphericalMenu.webContents.openDevTools();
    // } else {
    //   // we're on production; no access to devtools pls
    //   this.sphericalMenu.webContents.on("devtools-opened", () => {
    //     this.sphericalMenu.webContents.closeDevTools();
    //   });
    // }

    this.sphericalMenu.on("closed", () => {
      this.sphericalMenu = null;
    });

    // 禁止drag右键菜单
    this.sphericalMenu.hookWindowMessage(278, (e) => {
      this.sphericalMenu.setEnabled(false);
      let timer = setTimeout(() => {
        this.sphericalMenu.setEnabled(true);
        clearTimeout(timer);
        timer = null;
      }, 100);
    });
  }

  sendMsg(e, data) {
    this.sphericalMenu.webContents.send(e, data);
  }

  closeWin() {
    this.sphericalMenu.close();
  }

  show() {
    this.sphericalMenu.show();
    this.isShown = true;
  }

  hide() {
    this.sphericalMenu.hide();
    this.isShown = false;
  }
}

module.exports = sphericalMenuWindow;
