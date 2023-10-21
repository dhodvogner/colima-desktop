const { getSettings } = require('../settings/settings')
const { runCommand, parseOutputString } = require('../utils/command')
const { log } = require('../utils/logs')
const { ColimaStatuses, getCurrentStatus } = require('./colima-statuses')

// TODO: We are getting there
// But the updateTrayStatus function is still a mess...

const onStartColima = () => {
  log('Colima Desktop', 'Starting Colima')
  const { updateTrayStatus } = require('../tray/tray')
  updateTrayStatus(ColimaStatuses.Starting)

  const settings = getSettings()
  const args = ['start']

  if (settings.cpu) {
    args.push('--cpu', settings.cpu)
  }

  if (settings.memory) {
    args.push('--memory', settings.memory)
  }

  if (settings.disk) {
    args.push('--disk', settings.disk)
  }

  if (settings.rosettaEmulation) {
    args.push('--arch', 'aarch64', '--vm-type=vz', '--vz-rosetta')
  }

  runCommand(args).then(() => {
    const { updateTrayStatus } = require('../tray/tray')
    updateTrayStatus(ColimaStatuses.Running)
  })
}

const onStopColima = () => {
  log('Colima Desktop', 'Stopping Colima')
  const { updateTrayStatus } = require('../tray/tray')
  updateTrayStatus(ColimaStatuses.Stopping)
  runCommand(['stop']).then(() => {
    const { updateTrayStatus } = require('../tray/tray')
    updateTrayStatus(ColimaStatuses.NotRunning)
  })
}

const onRestartColima = () => {
  log('Colima Desktop', 'Restarting Colima')
  const { updateTrayStatus } = require('../tray/tray')
  updateTrayStatus(ColimaStatuses.Restarting)
  runCommand(['restart']).then(() => {
    const { updateTrayStatus } = require('../tray/tray')
    updateTrayStatus(ColimaStatuses.Running)
  })
}

const getColimaStatus = () => {
  return new Promise((resolve, reject) => {
    const status = getCurrentStatus()

    if (
      status === ColimaStatuses.Starting ||
      status === ColimaStatuses.Stopping ||
      status === ColimaStatuses.Restarting
    ) {
      resolve()
      return
    }

    const parseStdOutput = (data) => {
      const output = parseOutputString(data.toString())

      if (output.msg.indexOf('colima is running') === 0) {
        const { updateTrayStatus } = require('../tray/tray')
        updateTrayStatus(ColimaStatuses.Running)
      }

      if (output.msg.indexOf('colima is not running') === 0) {
        const { updateTrayStatus } = require('../tray/tray')
        updateTrayStatus(ColimaStatuses.NotRunning)
      }
    }

    const handlers = {
      onStdout: parseStdOutput,
      onStderr: parseStdOutput,
      onError: (error) => {
        reject(new Error(error.message))
      },
      onClose: () => {
        resolve()
      }
    }

    runCommand(['status'], handlers)
      .catch((error) => {
        log('Colima Desktop', error.message)
        reject(new Error(error.message))
      })
  })
}

module.exports = {
  onStartColima,
  onStopColima,
  onRestartColima,
  getColimaStatus
}
