const {ipcRenderer} = require('electron') 
    ipcRenderer.send('openFile', () => { 
    console.log("Event sent."); 
}) 
      
ipcRenderer.on('fileData', (event, data) => { 
    document.write(data) 
}) 