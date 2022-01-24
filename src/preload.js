const { contextBridge, ipcRenderer, remote, shell } = require("electron");
const { networkInterfaces } = require("os");
const { dialog } = require("electron").remote;
const fs = require("fs");

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer,
  remote,
  shell,
});
contextBridge.exposeInMainWorld("os", {
  networkInterfaces,
});
contextBridge.exposeInMainWorld("ipc", {
  on: (channel, listener) => {
    ipcRenderer.on(channel, (_evt, ...args) => listener(...args));
    return () => ipcRenderer.removeListener(channel, listener);
  },
});
contextBridge.exposeInMainWorld("fs", {
  fs,
});
contextBridge.exposeInMainWorld("tc", {
  dialog,
});
