const fs = require('fs')
const path = require('path')
const { BrowserWindow, ipcMain } = require('electron')

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
    const logs = fs.readFileSync('colima-desktop.log', 'utf-8')
    event.reply('get-logs-reply', logs)
  })

  win.webContents.openDevTools()
}

module.exports = {
  openSettings
}
