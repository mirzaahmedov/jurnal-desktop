import { BrowserWindow, app, ipcMain, shell } from 'electron'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'

import { NsisUpdater } from 'electron-updater'
import { events } from './auto-updater'
import fs from 'fs'
import icon from '@resources/icon.png?asset'
import { join } from 'path'
import os from 'os'
import path from 'path'

const url =
  import.meta.env.VITE_MODE === 'staging' ? 'http://10.50.0.140:4006' : 'http://10.50.0.140:4005'

const autoUpdater = new NsisUpdater({
  provider: 'generic',
  url
})

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    minWidth: 1920,
    minHeight: 1080,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', async () => {
    mainWindow.show()
    mainWindow.maximize()

    autoUpdater.on(events.checking_for_update, () => {
      mainWindow.webContents.send(events.checking_for_update)
    })

    autoUpdater.on(events.update_available, () => {
      mainWindow.webContents.send(events.update_available)
    })

    autoUpdater.on(events.download_progress, (progress) => {
      mainWindow.webContents.send(events.download_progress, progress)
    })

    autoUpdater.on(events.update_downloaded, () => {
      mainWindow.webContents.send(events.update_downloaded)
    })

    autoUpdater.on(events.error, (error) => {
      mainWindow.webContents.send(events.error, error)
    })

    ipcMain.on('check-for-updates', () => {
      autoUpdater.checkForUpdates()
    })

    ipcMain.on('restart', () => {
      autoUpdater.quitAndInstall()
    })

    ipcMain.on('open-dev-tools', () => {
      mainWindow.webContents.openDevTools()
    })

    ipcMain.on(
      'save-file',
      (_, { fileName, fileData }: { fileName: string; fileData: ArrayBuffer }) => {
        const folderPath = path.join(os.homedir(), 'Downloads/E-Moliya')
        const filePath = path.join(folderPath, fileName)

        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true })
          console.log(`create folder ${folderPath}`)
        }

        fs.writeFileSync(filePath, Buffer.from(fileData))
        console.log(`file save to ${filePath}`)
      }
    )

    ipcMain.handle('get-version', () => app.getVersion())
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

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
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
