const { app, Tray, Menu } = require('electron')
const { spawn } = require('child_process');

const { loadIcons, getTrayIcon } = require('./src/tray-icons');
const { ColimaStatuses, getstatusText } = require('./src/colima-statuses');

let tray, contextMenu

app.whenReady().then(() => {
  loadIcons();
  tray = new Tray(getTrayIcon(ColimaStatuses.NotRunning));
  tray.setToolTip('Colima Desktop')

  updateTrayStatus(ColimaStatuses.NotRunning);

  tray.on('click', async () => {
    await getColimaStatus();
    tray.popUpContextMenu(contextMenu)
  })
})

function onStartColima() {
  console.log('start')
  updateTrayStatus(ColimaStatuses.Starting)
  runColimaCommand(['start']).then(() => {
    updateTrayStatus(ColimaStatuses.Running)
  });
}

function onStopColima() {
  console.log('stop')
  updateTrayStatus(ColimaStatuses.Stopping)
  runColimaCommand(['stop']).then(() => {
    updateTrayStatus(ColimaStatuses.NotRunning)
  });
}

function onRestartColima() {
  console.log('restart')
  updateTrayStatus(ColimaStatuses.Restarting)
  runColimaCommand(['restart']).then(() => {
    updateTrayStatus(ColimaStatuses.Running)
  });
}

function getColimaStatus() {
  return new Promise((resolve, reject) => {

    if(colimaStatus === ColimaStatuses.Starting || colimaStatus === ColimaStatuses.Stopping || colimaStatus === ColimaStatuses.Restarting) {
      resolve();
      return;
    }

    const colimaInstance = spawn("colima", ['status']);

    colimaInstance.stdout.on("data", data => {
      const output = parseOutputString(data.toString())
      console.log(output);
      console.log(output.msg.indexOf('colima is running') === 0);

      if (output.msg.indexOf('colima is running') === 0) {
        updateTrayStatus(ColimaStatuses.Running)
      }

      if (output.msg.indexOf('colima is not running') === 0) {
        updateTrayStatus(ColimaStatuses.NotRunning)
      }
    })

    colimaInstance.stderr.on("data", data => {
      const output = parseOutputString(data.toString())
      console.log(output);

      if (output.msg.indexOf('colima is running') === 0) {
        updateTrayStatus(ColimaStatuses.Running)
      }

      if (output.msg.indexOf('colima is not running') === 0) {
        updateTrayStatus(ColimaStatuses.NotRunning)
      }
    });

    colimaInstance.on('error', (error) => {
      console.log(`error: ${error.message}`);
      reject()
    });

    colimaInstance.on("close", code => {
      console.log(`child process exited with code ${code}`);
      resolve()
    });
  });
}

let colimaStatus = ColimaStatuses.NotRunning
let colimaStatusTimeout = null

function updateTrayStatus(status) {
  colimaStatus = status

  tray.setImage(getTrayIcon(status))

  if(colimaStatus === ColimaStatuses.Starting || colimaStatus === ColimaStatuses.Stopping || colimaStatus === ColimaStatuses.Restarting) {
    colimaStatusTimeout = setTimeout(() => {
      updateTrayStatus(status)
    }, 300)
  } else {
    clearTimeout(colimaStatusTimeout)
  }

  contextMenu = Menu.buildFromTemplate([
    { id: 'status', label: `Status: ${getstatusText(status)}`, type: 'normal' },
    { type: 'separator' },
    { id: 'start', label: 'Start Colima', type: 'normal', click: onStartColima, enabled: colimaStatus !== ColimaStatuses.Running && colimaStatus !== ColimaStatuses.Starting },
    { id: 'stop', label: 'Stop Colima', type: 'normal', click: onStopColima, enabled: colimaStatus === ColimaStatuses.Running },
    { id: 'restart', label: 'Restart Colima', type: 'normal', click: onRestartColima, enabled: colimaStatus === ColimaStatuses.Running },
    { type: 'separator' },
    { type: 'normal', label: 'Settings', click: () => { console.log('settings') } },
    { type: 'normal', label: 'Close Colima Desktop', role: 'quit' },
  ])
}

function runColimaCommand(args) {
  return new Promise((resolve, reject) => {

    const colima = spawn("colima", args);

    colima.stdout.on("data", data => {
      console.log(`stdout: ${data}`);
    });

    colima.stderr.on("data", data => {
      console.log(`stderr: ${data}`);
    });

    colima.on('error', (error) => {
      console.log(`error: ${error.message}`);
      reject()
    });

    colima.on("close", code => {
      console.log(`child process exited with code ${code}`);
      if (code === 0) {
        resolve()
      } else {
        reject()
      }
    });

  });
}

function parseOutputString(string) {
  // time="2023-10-17T16:50:28+02:00" level=fatal msg="colima is not running"
  const regex = /(\w+)="([^"]+)"/g;
  const matches = string.matchAll(regex);
  const result = {};
  for (const match of matches) {
    result[match[1]] = match[2];
  }
  return result;
}