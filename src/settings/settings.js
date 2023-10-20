const fs = require('fs')
const path = require('path')
const { BrowserWindow, ipcMain } = require('electron')

const { log, getLogs, getAppDataPath } = require('../utils/logs')

let settingsWindow = null

const openSettings = () => {
  settingsWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Colima Desktop - Settings',
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  settingsWindow.loadFile('./src/settings/index.html')

  ipcMain.on('get-logs', (event) => {
    const logs = getLogs()
    event.reply('get-logs-reply', logs)
  })

  ipcMain.on('get-settings', (event) => {
    const settings = getSettings()
    event.reply('get-settings-reply', settings)
  })

  ipcMain.on('save-settings', (event, settings) => {
    saveSettings(settings)
  })

  ipcMain.on('open-dev-tools', () => {
    settingsWindow.webContents.openDevTools()
  })
}

const defaultSettings = {
  colimaPath: '/usr/local/bin/colima',
  cpu: 2,
  memory: 2,
  disk: 60,
  rosettaEmulation: false
}

const getSettings = () => {
  const appDataPath = getAppDataPath()
  const settingsFilePath = path.join(appDataPath, 'settings.json')

  if (!fs.existsSync(settingsFilePath)) {
    saveSettings(defaultSettings)
    return defaultSettings
  }

  const settings = fs.readFileSync(settingsFilePath, 'utf8')
  return JSON.parse(settings)
}

const saveSettings = (settings) => {
  const appDataPath = getAppDataPath()
  const settingsFilePath = path.join(appDataPath, 'settings.json')
  fs.writeFileSync(settingsFilePath, JSON.stringify(settings))
  log('Colima Desktop', 'Settings saved')
}

module.exports = {
  openSettings,
  getSettings
}
