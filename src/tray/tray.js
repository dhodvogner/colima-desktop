const { Tray, Menu } = require('electron')

const { setCurrentStatus, ColimaStatuses, getstatusText } = require('../colima/colima-statuses')
const { loadIcons, getTrayIcon } = require('./tray-icons')
const { onStartColima, onStopColima, onRestartColima, getColimaStatus } = require('../colima/colima-functions')

let tray, contextMenu
let iconUpdateTimeout = null

/**
 * Initializes the tray icon and sets up its behavior.
 * @function
 * @returns {void}
 */
const initTray = () => {
  loadIcons()
  tray = new Tray(getTrayIcon(ColimaStatuses.NotRunning))
  tray.setToolTip('Colima Desktop')

  updateTrayStatus(ColimaStatuses.NotRunning)

  tray.on('click', async () => {
    await getColimaStatus()
    tray.popUpContextMenu(contextMenu)
  })
}

/**
 * Updates the tray status and context menu based on the given status.
 * @param {string} status - The status of the tray.
 */
const updateTrayStatus = (status) => {
  setCurrentStatus(status)

  tray.setImage(getTrayIcon(status))

  if (
    status === ColimaStatuses.Starting ||
    status === ColimaStatuses.Stopping ||
    status === ColimaStatuses.Restarting
  ) {
    iconUpdateTimeout = setTimeout(() => {
      updateTrayStatus(status)
    }, 300)
  } else {
    clearTimeout(iconUpdateTimeout)
  }

  contextMenu = Menu.buildFromTemplate([
    { id: 'status', label: `Status: ${getstatusText(status)}`, type: 'normal' },
    { type: 'separator' },
    {
      id: 'start',
      label: 'Start Colima',
      type: 'normal',
      click: onStartColima,
      enabled:
        status !== ColimaStatuses.Running && status !== ColimaStatuses.Starting
    },
    {
      id: 'stop',
      label: 'Stop Colima',
      type: 'normal',
      click: onStopColima,
      enabled: status === ColimaStatuses.Running
    },
    {
      id: 'restart',
      label: 'Restart Colima',
      type: 'normal',
      click: onRestartColima,
      enabled: status === ColimaStatuses.Running
    },
    { type: 'separator' },
    {
      type: 'normal',
      label: 'Settings',
      click: () => {
        console.log('settings')
      }
    },
    { type: 'normal', label: 'Close Colima Desktop', role: 'quit' }
  ])
}

module.exports = {
  initTray,
  updateTrayStatus
}
