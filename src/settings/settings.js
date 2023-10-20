const path = require('path')
const { BrowserWindow, ipcMain } = require('electron')

const { getLogs } = require('../utils/logs')

const openSettings = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('./src/settings/index.html')

  ipcMain.on('get-logs', (event) => {
    const logs = getLogs()
    event.reply('get-logs-reply', logs)
  })

  win.webContents.openDevTools()
}

module.exports = {
  openSettings
}
