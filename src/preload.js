const { contextBridge, ipcRenderer, remote, shell } = require("electron");
const { networkInterfaces } = require("os");

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer,
  remote,
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
