/**
 * An object containing the possible statuses of a Colima instance.
 * @typedef {Object} ColimaStatuses
 * @property {string} Running - The status indicating that the Colima instance is running.
 * @property {string} NotRunning - The status indicating that the Colima instance is not running.
 * @property {string} Starting - The status indicating that the Colima instance is starting.
 * @property {string} Stopping - The status indicating that the Colima instance is stopping.
 * @property {string} Restarting - The status indicating that the Colima instance is restarting.
 */
const ColimaStatuses = {
  Running: 'running',
  NotRunning: 'not-running',
  Starting: 'starting',
  Stopping: 'stopping',
  Restarting: 'restarting'
}

const getstatusText = (status) => {
  switch (status) {
    case ColimaStatuses.Running:
      return 'Running'
    case ColimaStatuses.NotRunning:
      return 'Not running'
    case ColimaStatuses.Starting:
      return 'Starting...'
    case ColimaStatuses.Stopping:
      return 'Stopping...'
    case ColimaStatuses.Restarting:
      return 'Restarting...'
  }
}

let currentStatus = ColimaStatuses.NotRunning

const getCurrentStatus = () => {
  return currentStatus
}

const setCurrentStatus = (status) => {
  currentStatus = status
}

module.exports = {
  ColimaStatuses,
  getstatusText,
  getCurrentStatus,
  setCurrentStatus
}
