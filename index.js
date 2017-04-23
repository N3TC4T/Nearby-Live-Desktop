//Electron Main script

const electron = require('electron');

const {app , Menu, Tray} = electron;

const {BrowserWindow} = electron;

const path = require('path');

let mainWindow;
let appIcon = null;


function createWindow() {


  var Isprod = false ;

  // configuring mainWindow
  mainWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false
    },
    "node-integration": "iframe",
    resizable: true,
    'min-width': 800,
    'min-height': 600,
    width: 1024,
    height: 768,
    frame:false,
    show: true

  });


  // tray menu and icon

  if(Isprod){
    appIcon = new Tray(path.join(__dirname,'web','images', 'tray.png'));
  }else {
    appIcon = new Tray(path.join(__dirname,'app','images', 'tray.png'));
  }
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Open', click: function(){mainWindow.show()}},
    {label: 'Quit', click: function () {app.quit();}}
  ]);
  appIcon.setToolTip('NearbyLive');
  appIcon.setContextMenu(contextMenu);



  /*
   serving files to electron to load
   */


  if(Isprod){
    //for production
    mainWindow.loadURL('file://' + __dirname + '/web/index.html');
  }else {
    //for development
    mainWindow.loadURL(`http://localhost:3000`);
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }



  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}


app.on('ready', createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
