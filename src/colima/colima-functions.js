const { runCommand, parseOutputString } = require('../utils/command')
const { ColimaStatuses, getCurrentStatus } = require('./colima-statuses')

// TODO: Refactor this file!
// First we need to figure out some sort of structure for this.
// Than the updateTrayStatus function also needs to be refactored.
// This is a mess right now...

const onStartColima = () => {
  console.log('start')
  const { updateTrayStatus } = require('../tray/tray')
  updateTrayStatus(ColimaStatuses.Starting)
  runCommand(['start']).then(() => {
    const { updateTrayStatus } = require('../tray/tray')
    updateTrayStatus(ColimaStatuses.Running)
  })
}

const onStopColima = () => {
  console.log('stop')
  const { updateTrayStatus } = require('../tray/tray')
  updateTrayStatus(ColimaStatuses.Stopping)
  runCommand(['stop']).then(() => {
    const { updateTrayStatus } = require('../tray/tray')
    updateTrayStatus(ColimaStatuses.NotRunning)
  })
}

const onRestartColima = () => {
  console.log('restart')
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
        console.log(error)
      })
  })
}

module.exports = {
  onStartColima,
  onStopColima,
  onRestartColima,
  getColimaStatus
}
