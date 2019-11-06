const { app, BrowserWindow, Menu, Tray, nativeImage } = require('electron')
require('./server') //Create a server instance
    // Keep a global reference of the window object, if you don't, the window will
    // be closed automatically when the JavaScript object is garbage collected.
let win
let tray = null
const iconPath = __dirname + '/build/icon.png';
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (win) {
            if (!win.isVisible()) win.show()
            if (win.isMinimized()) win.restore()
            win.focus()
        }
    })
}

//Executes when app is ready
app.on('ready', () => {
    tray = new Tray(nativeImage.createFromPath(iconPath))
    const contextMenu = Menu.buildFromTemplate([{
        label: 'Salir',
        click: () => {
            app.exit(0);
        }
    }, ])
    tray.setToolTip('Emite Server')
    tray.setContextMenu(contextMenu)
    tray.on('double-click', () => {
        //createWindow();
        win.show();
    })
    createWindow();
})

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 500,
        height: 250,
        resizable: false,
        title: "Emite Server",

        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    win.loadFile('index.html')

    // Open the DevTools.

    //win.webContents.openDevTools()

    win.on("close", (evt) => {
        evt.preventDefault(); // This will cancel the close
        win.hide();
    });

    // Emitted when the window is closed.
    win.on('closed', (event) => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.