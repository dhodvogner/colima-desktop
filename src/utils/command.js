const fs = require('fs')
const { spawn } = require('node:child_process')

const log = (source, message) => {
  const logMessage = `${new Date().toISOString()}|[${source}]|${message}`
  fs.writeFileSync('colima-desktop.log', logMessage, { flag: 'a+' })
}

const runCommand = (args, handlers) => {
  if (handlers === undefined) {
    handlers = {
      onStdout: () => {},
      onStderr: () => {},
      onError: () => {},
      onClose: () => {}
    }
  }

  return new Promise((resolve, reject) => {
    const colima = spawn('colima', args)

    colima.stdout.on('data', data => {
      log('stdout', data)
      handlers.onStdout(data)
    })

    colima.stderr.on('data', data => {
      log('stderr', data)
      handlers.onStderr(data)
    })

    colima.on('error', (error) => {
      log('error', error.message)
      handlers.onError(error)
      reject(new Error(error.message))
    })

    colima.on('close', code => {
      log('close', `child process exited with code ${code}`)
      handlers.onClose(code)
      resolve(code)
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
  runCommand,
  parseOutputString
}
