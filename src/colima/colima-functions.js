const { spawn } = require('child_process')

const { ColimaStatuses, getCurrentStatus } = require('./colima-statuses')

// TODO: Refactor this file!
// First we need to figure out some sort of structure for this.
// Than the updateTrayStatus function also needs to be refactored.
// This is a mess right now...

const onStartColima = () => {
  console.log('start')
  const { updateTrayStatus } = require('../tray/tray')
  updateTrayStatus(ColimaStatuses.Starting)
  runColimaCommand(['start']).then(() => {
    const { updateTrayStatus } = require('../tray/tray')
    updateTrayStatus(ColimaStatuses.Running)
  })
}

const onStopColima = () => {
  console.log('stop')
  const { updateTrayStatus } = require('../tray/tray')
  updateTrayStatus(ColimaStatuses.Stopping)
  runColimaCommand(['stop']).then(() => {
    const { updateTrayStatus } = require('../tray/tray')
    updateTrayStatus(ColimaStatuses.NotRunning)
  })
}

const onRestartColima = () => {
  console.log('restart')
  const { updateTrayStatus } = require('../tray/tray')
  updateTrayStatus(ColimaStatuses.Restarting)
  runColimaCommand(['restart']).then(() => {
    const { updateTrayStatus } = require('../tray/tray')
    updateTrayStatus(ColimaStatuses.Running)
  })
}

const getColimaStatus = () => {
  return new Promise((resolve, reject) => {
    const status = getCurrentStatus()

    if (status === ColimaStatuses.Starting || status === ColimaStatuses.Stopping || status === ColimaStatuses.Restarting) {
      resolve()
      return
    }

    const colimaInstance = spawn('colima', ['status'])

    colimaInstance.stdout.on('data', data => {
      const output = parseOutputString(data.toString())
      console.log(output)
      console.log(output.msg.indexOf('colima is running') === 0)

      if (output.msg.indexOf('colima is running') === 0) {
        const { updateTrayStatus } = require('../tray/tray')
        updateTrayStatus(ColimaStatuses.Running)
      }

      if (output.msg.indexOf('colima is not running') === 0) {
        const { updateTrayStatus } = require('../tray/tray')
        updateTrayStatus(ColimaStatuses.NotRunning)
      }
    })

    colimaInstance.stderr.on('data', data => {
      const output = parseOutputString(data.toString())
      console.log(output)

      if (output.msg.indexOf('colima is running') === 0) {
        const { updateTrayStatus } = require('../tray/tray')
        updateTrayStatus(ColimaStatuses.Running)
      }

      if (output.msg.indexOf('colima is not running') === 0) {
        const { updateTrayStatus } = require('../tray/tray')
        updateTrayStatus(ColimaStatuses.NotRunning)
      }
    })

    colimaInstance.on('error', (error) => {
      console.log(`error: ${error.message}`)
      reject(new Error(error.message))
    })

    colimaInstance.on('close', code => {
      console.log(`child process exited with code ${code}`)
      resolve()
    })
  })
}

const runColimaCommand = (args) => {
  return new Promise((resolve, reject) => {
    const colima = spawn('colima', args)

    colima.stdout.on('data', data => {
      console.log(`stdout: ${data}`)
    })

    colima.stderr.on('data', data => {
      console.log(`stderr: ${data}`)
    })

    colima.on('error', (error) => {
      console.log(`error: ${error.message}`)
      reject(new Error(error.message))
    })

    colima.on('close', code => {
      console.log(`child process exited with code ${code}`)
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`child process exited with code ${code}`))
      }
    })
  })
}

/**
 * Parses a string and returns an object containing key-value pairs
 * Example: time="2023-10-17T16:50:28+02:00" level=fatal msg="colima is not running"
 * @param {string} string - The string to be parsed
 * @returns {Object} - An object containing key-value pairs
 */
const parseOutputString = (string) => {
  const regex = /(\w+)="([^"]+)"/g
  const matches = string.matchAll(regex)
  const result = {}
  for (const match of matches) {
    result[match[1]] = match[2]
  }
  return result
}

module.exports = {
  onStartColima,
  onStopColima,
  onRestartColima,
  getColimaStatus
}
