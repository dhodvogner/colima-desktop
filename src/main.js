const { app } = require('electron')

const { initTray } = require('./tray/tray')

app.whenReady().then(() => {
  initTray()
}).catch(err => {
  console.error(err)
})

app.on('window-all-closed', e => e.preventDefault())
