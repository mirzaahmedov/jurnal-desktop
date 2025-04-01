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

let counter = 0
let interval: NodeJS.Timeout | null = null
let initialCheckForUpdate = true
let windows: BrowserWindow[] = []

const folderPath = path.join(os.homedir(), 'Downloads/E-Moliya')

const logMessage = (message: any) => {
  const filePath = path.join(folderPath, 'log.txt')
  fs.appendFileSync(filePath, `${new Date().toISOString()} - ${message}\n`)
}

if (import.meta.env.DEV) {
  dotenv.config()
}

const CHECK_UPDATES_INTERVAL = 30 * 1000

const url =
  import.meta.env.VITE_MODE === 'staging'
    ? 'https://nafaqa.fizmasoft.uz'
    : 'http://10.50.0.140:4005'

const autoUpdater = new NsisUpdater({
  provider: 'generic',
  url
})

function createWindow(): void {
  // Create the browser window.
  const win = new BrowserWindow({
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

  win.on('ready-to-show', async () => {
    win.show()
    win.maximize()
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  windows.push(win)

  win.on('closed', () => {
    windows = windows.filter((w) => w !== win)
  })
}

// Update manager
autoUpdater.on(events.checking_for_update, () => {
  if (initialCheckForUpdate) {
    windows.forEach((win) => {
      win.webContents.send(events.checking_for_update)
    })
  }
})

autoUpdater.on(events.update_available, () => {
  if (initialCheckForUpdate) {
    windows.forEach((win) => {
      win.webContents.send(events.update_available)
    })
  }
})

autoUpdater.on(events.download_progress, (progress) => {
  if (initialCheckForUpdate) {
    windows.forEach((win) => {
      win.webContents.send(events.download_progress, progress)
    })
  }
})

autoUpdater.on(events.update_not_available, () => {
  initialCheckForUpdate = false
})

autoUpdater.on(events.update_downloaded, () => {
  windows.forEach((win) => {
    if (initialCheckForUpdate) {
      win.webContents.send(events.update_downloaded)
      initialCheckForUpdate = false
    } else {
      win.webContents.send(events.update_downloaded_silent)
    }
  })
})

autoUpdater.on(events.error, (error) => {
  windows.forEach((win) => {
    win.webContents.send(events.error, error)
  })
  initialCheckForUpdate = false
})

// IPC Communication
// -----------------------------
// -----------------------------
// -----------------------------
// -----------------------------
ipcMain.on('check-for-updates', () => {
  autoUpdater.checkForUpdates()
})

ipcMain.on('restart', () => {
  autoUpdater.quitAndInstall()
})

ipcMain.on('open-dev-tools', (e) => {
  e.sender.openDevTools()
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
ipcMain.handle('set-zoom-factor', (e, factor) => {
  e.sender.setZoomFactor(factor)
})
ipcMain.handle('get-zoom-factor', (e) => {
  return e.sender.getZoomFactor()
})

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

  let title = 'New Window'
  let description = 'Open a new window for additional tasks or views.'
  const locale = app.getLocale()

  if (locale.startsWith('ru')) {
    title = 'Новое окно'
    description = 'Откройте новое окно для дополнительных задач или просмотра.'
  } else if (locale.startsWith('uz')) {
    title = 'Yangi oyna'
    description = 'Qo‘shimcha vazifalar yoki ko‘rish uchun yangi oyna oching.'
  }

  app.setUserTasks([
    {
      program: process.execPath,
      arguments: '',
      iconPath: process.execPath,
      iconIndex: 0,
      title,
      description
    }
  ])

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  if (!interval) {
    interval = setInterval(() => {
      logMessage(`Checking for updates... ${counter}`)
      if (!autoUpdater.isUpdaterActive()) {
        autoUpdater.checkForUpdates()
      }
      counter += 1
    }, CHECK_UPDATES_INTERVAL)
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const cleanup = () => {
  if (interval) clearInterval(interval)
}

app.on('before-quit', () => {
  cleanup()
})
app.on('quit', () => {
  cleanup()
})

const locked = app.requestSingleInstanceLock()
if (locked) {
  app.on('second-instance', () => {
    createWindow()
  })
} else {
  app.exit(0)
}

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
