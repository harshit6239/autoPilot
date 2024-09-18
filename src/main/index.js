import { app, shell, BrowserWindow, ipcMain, Notification, Tray, Menu } from 'electron'
import { join } from 'path'
import ScriptScheduler from './lib/index.js'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let mainWindow
let tray = null
let scriptScheduler = null

function createTray() {
  // Create a tray icon
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'quit', type: 'normal', click: () => app.quit() }
  ])
  tray.setToolTip('Auto Pilot')
  tray.setContextMenu(contextMenu)
  tray.addListener('click', () => {
    mainWindow.show()
    tray.destroy()
    tray = null
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    minHeight: 670,
    minWidth: 900,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    center: true,
    title: 'Auto Pilot',
    transparent: true,
    backgroundMaterial: 'mica',
    backgroundColor: '#11111100',
    titleBarOverlay: {
      color: '#11111100',
      symbolColor: '#ffffff'
    },
    resizable: true,
    frame: false,
    fullscreenable: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      sandbox: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function showNotification(title, body) {
  const notification = new Notification({
    title,
    body
  })

  notification.show()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  if (!scriptScheduler) {
    scriptScheduler = new ScriptScheduler()
  }
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  // ipcMain.on('ping', () => console.log('pong'))

  ipcMain.on('notify', () => {
    showNotification('Auto Pilot', 'Script added successfully')
  })

  ipcMain.handle('getScripts', () => {
    console.log(scriptScheduler.scripts)
    return scriptScheduler.scripts
  })

  ipcMain.on('addScript', (_, script) => {
    // scriptScheduler.addScript(script)
    console.log(script)
  })

  ipcMain.on('minimizeApp', () => {
    // console.log('minimizeApp')
    mainWindow?.minimize()
  })
  ipcMain.on('maximizeApp', () => {
    // console.log('maximizeApp')
    if (mainWindow?.isMaximized()) {
      mainWindow?.setSize(800, 600)
      mainWindow?.center()
    } else {
      mainWindow?.maximize()
    }
  })
  ipcMain.on('closeApp', () => {
    mainWindow?.hide()
    createTray()
    showNotification('Auto Pilot', 'Auto Pilot is running in the background')
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // app.quit()
    app.dock.hide()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
