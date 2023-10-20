const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getLogs: () => ipcRenderer.send('get-logs'),
  onLogs: (callback) => ipcRenderer.on('get-logs-reply', (event, args) => callback(args)),
  getSettings: () => ipcRenderer.send('get-settings'),
  onSettings: (callback) => ipcRenderer.on('get-settings-reply', (event, args) => callback(args)),
  saveSettings: (settings) => ipcRenderer.send('save-settings', settings)
})
