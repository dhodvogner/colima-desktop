document.addEventListener('DOMContentLoaded', () => {
  window.electronAPI.getLogs()

  document.getElementById('refresh-logs').addEventListener('click', () => {
    window.electronAPI.getLogs()
  })

  document.getElementById('settings-form').addEventListener('submit', (event) => {
    event.preventDefault()
    event.stopPropagation()

    const formData = new FormData(event.target)
    console.log(formData)

    // TODO: Save settings
  })
})

window.electronAPI.onLogs((logs) => {
  const body = document.querySelector('.logs')
  body.innerText = logs
})
