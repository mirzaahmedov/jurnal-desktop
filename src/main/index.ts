import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import iconDev from '@resources/icon-dev.png?asset'
import icon from '@resources/icon.png?asset'
import dotenv from 'dotenv'
import { BrowserWindow, app, ipcMain, shell } from 'electron'
import { NsisUpdater } from 'electron-updater'
import fs from 'fs'
import os from 'os'
import path from 'path'

import { events } from './auto-updater'

if (import.meta.env.DEV) {
  dotenv.config()
}

const CHECK_UPDATES_INTERVAL = 1 * 60 * 1000

const url =
  import.meta.env.VITE_MODE === 'staging'
    ? 'https://nafaqa.fizmasoft.uz'
    : 'http://10.50.0.140:4005'

const autoUpdater = new NsisUpdater({
  provider: 'generic',
  url
})

function createWindow(): void {
  let initialCheckForUpdate = true

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    minWidth: 1920,
    minHeight: 1080,
    autoHideMenuBar: true,
    ...(process.platform === 'linux'
      ? { icon: import.meta.env.VITE_MODE === 'prod' ? icon : iconDev }
      : { icon: import.meta.env.VITE_MODE === 'prod' ? icon : iconDev }),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', async () => {
    mainWindow.show()
    mainWindow.maximize()

    autoUpdater.on(events.checking_for_update, () => {
      if (initialCheckForUpdate) {
        mainWindow.webContents.send(events.checking_for_update)
      }
    })

    autoUpdater.on(events.update_available, () => {
      if (initialCheckForUpdate) {
        mainWindow.webContents.send(events.update_available)
      }
    })

    autoUpdater.on(events.download_progress, (progress) => {
      if (initialCheckForUpdate) {
        mainWindow.webContents.send(events.download_progress, progress)
      }
    })

    autoUpdater.on(events.update_not_available, () => {
      initialCheckForUpdate = false
    })

    autoUpdater.on(events.update_downloaded, () => {
      if (initialCheckForUpdate) {
        mainWindow.webContents.send(events.update_downloaded)
        initialCheckForUpdate = false
      } else {
        mainWindow.webContents.send(events.update_downloaded_silent)
      }
    })

    autoUpdater.on(events.error, (error) => {
      mainWindow.webContents.send(events.error, error)
      initialCheckForUpdate = false
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

    ipcMain.handle(
      'save-file',
      (_, { fileName, fileData }: { fileName: string; fileData: ArrayBuffer }) => {
        const folderPath = path.join(os.homedir(), 'Downloads/E-Moliya')
        const filePath = path.join(folderPath, fileName)

        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true })
          console.log(`created folder ${folderPath}`)
        }

        fs.writeFileSync(filePath, Buffer.from(fileData))
        console.log(`file saved to ${filePath}`)

        shell.openPath(filePath).catch((err) => {
          console.error('Failed to open file:', err)
        })
      }
    )

    ipcMain.handle('get-version', () => app.getVersion())
    ipcMain.handle('set-zoom-factor', (_, factor) => {
      mainWindow.webContents.setZoomFactor(factor)
    })
    ipcMain.handle('get-zoom-factor', () => {
      return mainWindow.webContents.getZoomFactor()
    })

    setInterval(() => {
      autoUpdater.checkForUpdates()
    }, CHECK_UPDATES_INTERVAL)
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
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
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
