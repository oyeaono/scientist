"use strict";

import {
  app,
  protocol,
  ipcMain,
  dialog,
  Menu,
  Tray,
  nativeImage,
} from "electron";
import path from "path";
// import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== "production";
const MainWindow = require("./controllers/main");
const SplashWindow = require("./controllers/splash");
const InvitationCodeWindow = require("./controllers/invitation-code");
const AutoOrderWindow = require("./controllers/auto-order");
const PreemptivePurchaseWindow = require("./controllers/preemptive-purchase");
const PreSaleWindow = require("./controllers/pre-sale");
const SphericalMenuWindow = require("./controllers/spherical-menu");
const fs = require("fs");
import axios from "axios";
const getPcMsg = require("./utils/main-hardware.js");
// 防止系统托盘被辣鸡回收干掉
let appTray = null;
const trayImg = app.isPackaged
  ? path.join(__dirname, "/favicon.ico")
  : path.join(__dirname, "../src/assets/icon.ico");

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.exit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.exit();
    });
  }
}

class Scientist {
  constructor() {
    this.mainWindow = null;
    this.splashWindow = null;
    this.invitationCodeWindow = null;
    this.autoOrderWindow = null;
    this.preemptivePurchaseWindow = null;
  }

  createSplashWindow() {
    this.splashWindow = new SplashWindow();
    this.splashWindow.show();
  }

  createInvitationCodeWindow() {
    this.invitationCodeWindow = new InvitationCodeWindow();
    this.invitationCodeWindow.hide();
  }

  createMainWindow() {
    this.mainWindow = new MainWindow();
    this.mainWindow.hide();
  }

  createAutoOrderWindow() {
    this.autoOrderWindow = new AutoOrderWindow();
  }

  createPreemptivePurchaseWindow() {
    this.preemptivePurchaseWindow = new PreemptivePurchaseWindow();
  }

  createPreSaleWindow() {
    this.preSaleWindow = new PreSaleWindow();
  }

  createSphericalMenuWindow() {
    this.sphericalMenu = new SphericalMenuWindow();
  }

  init() {
    this.initApp();
  }

  tray() {
    // 系统托盘右键菜单
    const trayMenuTemplate = [
      {
        label: "打开",
        click: () => {
          this.mainWindow.show();
        }, // 打开相应页面
      },
      {
        label: "退出",
        click: () => {
          // ipc.send('close-main-window');
          app.exit();
        },
      },
    ];
    // 系统托盘图标目录
    appTray = new Tray(nativeImage.createFromPath(trayImg));
    // 图标的上下文菜单
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

    // 设置此托盘图标的悬停提示内容
    appTray.setToolTip("巅峰社区");

    // 设置此图标的上下文菜单
    appTray.setContextMenu(contextMenu);
  }

  initApp() {
    app.whenReady().then(() => {
      this.tray();
    });
    app.on("ready", () => {
      fs.access("cdk.txt", (err) => {
        console.log("err", err);
        if (err) {
          this.createSplashWindow();
          this.createInvitationCodeWindow();
          this.createMainWindow();
        } else {
          const cdk = fs.readFileSync("cdk.txt", "utf-8");
          axios
            .post(
              "https://test.hyiot.vip:7899/api/user/checkPassword",
              `password=${cdk}&pcAddress=${getPcMsg.mac}`
            )
            .then((res) => {
              if (res.data.code === 100000) {
                this.createSplashWindow();
                let timer1 = setTimeout(() => {
                  this.createMainWindow();
                  clearTimeout(timer1);
                  timer1 = null;
                }, 2000);
                let timer2 = setTimeout(() => {
                  this.mainWindow.show();
                  this.mainWindow.sendMsg("start-check", {
                    isClose: true,
                  });
                  clearTimeout(timer2);
                  timer2 = null;
                }, 3000);
              } else {
                fs.unlink("cdk.txt", () => {});
                dialog.showErrorBox("", res.data.msg);
              }
            })
            .catch(() => {});
        }
      });
    });

    // cdk和机器码校验不通过
    ipcMain.on("valid-error", (e, res) => {
      if (res.isClose) {
        this.mainWindow.hide();
        this.createInvitationCodeWindow();
        this.invitationCodeWindow.show();
      }
    });

    // 主程加载完
    ipcMain.on("main-finish", (e, res) => {
      if (res.isClose) {
        this.splashWindow.hide();
        if (this.invitationCodeWindow) {
          this.invitationCodeWindow.show();
        }
      }
    });

    // 提交邀请码
    ipcMain.on("invitation-code-finish", (e, res) => {
      if (res.isClose) {
        // 开启定时检测
        this.mainWindow.sendMsg("start-check", {
          isClose: true,
        });
        this.mainWindow.show();
        if (this.invitationCodeWindow) {
          this.invitationCodeWindow.closeWin();
        }
      }
    });

    // 启动自动交易
    ipcMain.on("open-order", (e, res) => {
      if (res.isClose) {
        this.createAutoOrderWindow();
      } else {
        this.mainWindow.sendMsg("resetBtn", {
          isClose: true,
        });
        this.autoOrderWindow.closeWin();
      }
    });

    // 自动交易获取实时价格
    ipcMain.on("real-time-price", (e, res) => {
      this.mainWindow.sendMsg("echo-price", res.data);
    });

    // 启动抢开盘
    ipcMain.on("open-preempt", (e, res) => {
      if (res.isClose) {
        this.createPreemptivePurchaseWindow();
      } else {
        this.mainWindow.sendMsg("resetMarketBtn", {
          isClose: true,
        });
        this.preemptivePurchaseWindow.closeWin();
      }
    });

    // 抢开盘实时信息
    ipcMain.on("preempt-echo", (e, res) => {
      this.mainWindow.sendMsg("echo-preempt", res.data);
    });

    // 启动抢预售
    ipcMain.on("open-pre-sale", (e, res) => {
      if (res.isClose) {
        this.createPreSaleWindow();
      } else {
        this.mainWindow.sendMsg("resetPreBtn", {
          isClose: true,
        });
        this.preSaleWindow.closeWin();
      }
    });

    // 抢预售实时信息
    ipcMain.on("pre-sale-echo", (e, res) => {
      this.mainWindow.sendMsg("echo-pre-sale", res.data);
    });

    // 关闭程序清空localstorage
    ipcMain.on("shut-down", (e, res) => {
      if (res.isClose) {
        dialog
          .showMessageBox({
            type: "info",
            title: "提示",
            defaultId: 0,
            cancelId: 2,
            message: "确定要关闭吗？",
            buttons: ["悬浮球", "直接退出"],
          })
          .then((res) => {
            if (res.response === 0) {
              e.preventDefault(); // 阻止默认行为，一定要有
              this.mainWindow.hide(); // 调用 最小化实例方法
              this.createSphericalMenuWindow();
            } else if (res.response === 1) {
              // app.quit() 不要用quit() 会弹两次
              app.exit(); // exit()直接关闭客户端，不会执行quit();
            }
          });
      }
    });

    // 关闭程序
    ipcMain.on("close-win", (e, res) => {
      if (res.isClose) {
        app.exit();
      }
    });

    // 窗口最大化
    ipcMain.on("maximize", (e, res) => {
      if (res.isClose) {
        this.mainWindow.show();
        this.sphericalMenu.closeWin();
      }
    });

    app.on("before-quit", () => {
      this.mainWindow.hide();
    });

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.exit();
      }
    });

    // 阻止程序多开
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      app.exit();
    }

    app.on("activate", () => {
      if (this.mainWindow === null) {
        this.createMainWindow();
      } else {
        this.mainWindow.show();
      }
    });

    // 提示更新
    ipcMain.on("renew", (e, res) => {
      if (res.isClose) {
        this.splashWindow.closeWin();
        app.exit();
      }
    });
  }
}

new Scientist().init();
