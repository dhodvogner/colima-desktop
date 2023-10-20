document.addEventListener('DOMContentLoaded', () => {
  window.electronAPI.getLogs()
  window.electronAPI.getSettings()

  document.getElementById('refresh-logs').addEventListener('click', () => {
    window.electronAPI.getLogs()
  })

  document.getElementById('open-dev-tools').addEventListener('click', () => {
    window.electronAPI.openDevTools()
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

  initTabs()
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

const initTabs = () => {
  const tabs = document.querySelectorAll('.ms-tab li a')
  tabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
      event.preventDefault()

      const targetTab = event.target.dataset.targetTab
      const activeTab = document.querySelector('.tab.active')
      const targetTabElement = document.querySelector(`.tab.${targetTab}`)

      console.log(targetTab, activeTab, targetTabElement)

      activeTab.classList.remove('active')
      activeTab.classList.add('ms-display-none')
      targetTabElement.classList.remove('ms-display-none')
      targetTabElement.classList.add('active')

      const activeTabLink = document.querySelector('.ms-tab li a.ms-active')
      activeTabLink.classList.remove('ms-active')

      event.target.classList.add('ms-active')
    })
  })
}
