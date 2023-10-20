const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getLogs: () => ipcRenderer.send('get-logs'),
  onLogs: (callback) => ipcRenderer.on('get-logs-reply', (event, args) => callback(args))
})
