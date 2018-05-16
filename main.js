const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const Tray = electron.Tray 
const Menu = electron.Menu
const Mysql = electron.Mysql
const ipcMain = electron.ipcMain
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    minWidth:800,
    minHeight:600,
    icon: path.join(__dirname, 'build/icons/icon.png')
  })
  
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  let trayIcon = new Tray(path.join('build/icons/icon.png'))
  const trayMenuTemplate = [{
    label: 'Open Application',
    click: function () {
      console.log("Clicked on Open Application")
      mainWindow.show()
    }
  },
  {
    label: 'Settings',
    click: function () {
      console.log("Clicked on settings")
    }
  },
  {
    label: 'Exit Application',
    click: function () {
      console.log("Clicked on Exit Application")
      app.exit();
    }
  }]
         
  let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
  trayIcon.setContextMenu(trayMenu)
  trayIcon.addListener("double-click", function () {
    mainWindow.show();
  })
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('show', function () {
    trayIcon.setHighlightMode('always')
  })

  mainWindow.on('close', (event) => {
    if (mainWindow.forceClose) return;
    event.preventDefault();
    mainWindow.hide();
  });
}

ipcMain.on('openFile', (event, path) => { 
  const {dialog} = require('electron') 
  const fs = require('fs') 
  dialog.showOpenDialog(function (fileNames) { 
     
     // fileNames is an array that contains all the selected 
     if(fileNames === undefined) { 
        console.log("No file selected"); 
     
     } else { 
        readFile(fileNames[0]); 
     } 
  });
  
  function readFile(filepath) { 
     fs.readFile(filepath, 'utf-8', (err, data) => {         
        if(err){ 
           alert("An error ocurred reading the file :" + err.message) 
           return 
        }         
        // handle the file content 
        event.sender.send('fileData', data) 
     }) 
    } 
  }) 
  
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
