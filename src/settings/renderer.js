document.addEventListener('DOMContentLoaded', () => {
  window.electronAPI.getLogs()
})

window.electronAPI.onLogs((logs) => {
  const body = document.querySelector('.logs')
  body.innerText = logs
})
