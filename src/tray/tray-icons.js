const path = require('path')
const { nativeImage } = require('electron')
const { ColimaStatuses } = require('../colima/colima-statuses')

const icons = {
  stopped: null,
  starting1: null,
  starting2: null,
  starting3: null,
  starting4: null,
  started: null
}

let startingAnimFrame = 1

const loadIcons = () => {
  icons.started = nativeImage.createFromPath(
    path.join(__dirname, '../assets/colima-started.png')
  )
  icons.stopped = nativeImage.createFromPath(
    path.join(__dirname, '../assets/colima-stopped.png')
  )
  icons.starting1 = nativeImage.createFromPath(
    path.join(__dirname, '../assets/colima-starting-1.png')
  )
  icons.starting2 = nativeImage.createFromPath(
    path.join(__dirname, '../assets/colima-starting-2.png')
  )
  icons.starting3 = nativeImage.createFromPath(
    path.join(__dirname, '../assets/colima-starting-3.png')
  )
  icons.starting4 = nativeImage.createFromPath(
    path.join(__dirname, '../assets/colima-started.png')
  )
}

const getTrayIcon = (status) => {
  let icon = icons.stopped

  if (
    status === ColimaStatuses.Starting ||
    status === ColimaStatuses.Restarting
  ) {
    startingAnimFrame = startingAnimFrame + 1
    if (startingAnimFrame > 4) {
      startingAnimFrame = 1
    }
    icon = icons[`starting${startingAnimFrame}`]
  }

  if (status === ColimaStatuses.Stopping) {
    startingAnimFrame = startingAnimFrame - 1
    if (startingAnimFrame <= 0) {
      startingAnimFrame = 4
    }
    icon = icons[`starting${startingAnimFrame}`]
  }

  if (status === ColimaStatuses.Running) {
    icon = icons.started
  }

  return icon.resize({ width: 16, height: 16 })
}

module.exports = {
  loadIcons,
  getTrayIcon
}
