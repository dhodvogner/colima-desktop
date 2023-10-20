document.addEventListener('DOMContentLoaded', () => {
  window.electronAPI.getLogs()
  window.electronAPI.getSettings()

  document.getElementById('refresh-logs').addEventListener('click', () => {
    window.electronAPI.getLogs()
  })

  document.getElementById('settings-form').addEventListener('submit', (event) => {
    event.preventDefault()
    event.stopPropagation()

    const formData = new FormData(event.target)
    const rossetaEmulation = document.getElementById('rosetta-emulation').checked

    const settings = {
      colimaPath: formData.get('colima-path'),
      cpu: formData.get('cpu'),
      memory: formData.get('memory'),
      disk: formData.get('disk'),
      rosettaEmulation: rossetaEmulation
    }

    console.log(settings)
    window.electronAPI.saveSettings(settings)
  })
})

window.electronAPI.onLogs((logs) => {
  const body = document.querySelector('.logs')
  body.innerText = logs
})

window.electronAPI.onSettings((settings) => {
  console.log(settings)
  const form = document.getElementById('settings-form')
  setFormElementValue(form, 'colima-path', settings.colimaPath)
  setFormElementValue(form, 'cpu', settings.cpu)
  setFormElementValue(form, 'memory', settings.memory)
  setFormElementValue(form, 'disk', settings.disk)

  if (settings.rosettaEmulation) {
    form.querySelector('input[name=rosetta-emulation]').setAttribute('checked', 'checked')
  } else {
    form.querySelector('input[name=rosetta-emulation]').removeAttribute('checked')
  }
})

const setFormElementValue = (form, name, value) => {
  const input = form.querySelector(`input[name=${name}]`)
  input.value = value
}
