const fs = require('fs')
const path = require('path')

const getAppDataPath = () => {
  switch (process.platform) {
    case 'darwin': {
      return path.join(process.env.HOME, 'Library', 'Application Support', 'colima-desktop')
    }
    case 'win32': {
      return path.join(process.env.APPDATA, 'colima-desktop')
    }
    case 'linux': {
      return path.join(process.env.HOME, '.colima-desktop')
    }
    default: {
      log('Colima Desktop', 'Unsupported platform!')
      process.exit(1)
    }
  }
}

const getLogFilePath = () => {
  const appDatatDirPath = getAppDataPath()

  if (!fs.existsSync(appDatatDirPath)) {
    fs.mkdirSync(appDatatDirPath)
  }

  const logFilePath = path.join(appDatatDirPath, 'colima-desktop.log')
  return logFilePath
}

const log = (source, message) => {
  const logFilePath = getLogFilePath()

  let logMessage = `${new Date().toISOString()}|[${source}]|${message}`
  if (logMessage.endsWith('\n') === false) {
    logMessage = `${logMessage}\n`
  }

  console.log(logMessage)
  fs.writeFileSync(logFilePath, logMessage, { flag: 'a+' })
}

const getLogs = () => {
  const logFilePath = getLogFilePath()
  const logs = fs.readFileSync(logFilePath, 'utf8')
  return logs
}

module.exports = {
  getAppDataPath,
  getLogs,
  log
}
