import type { OpenRouteNewWindowArgs, SaveFileArgs, SaveFileResponse } from '@preload/interfaces'

import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import iconDev from '@resources/icon-dev.png?asset'
import icon from '@resources/icon.png?asset'
import { exec } from 'child_process'
import dotenv from 'dotenv'
import { BrowserWindow, app, ipcMain, screen, shell } from 'electron'
import { REACT_DEVELOPER_TOOLS, installExtension } from 'electron-devtools-installer'
import { NsisUpdater } from 'electron-updater'
import fs from 'fs'
import os from 'os'
import path from 'path'

import { events } from './auto-updater'

// let counter = 0
let interval: NodeJS.Timeout | null = null
let initialCheckForUpdate = true
let windows: BrowserWindow[] = []

const normalizeFileName = (fileName: string): string => {
  return fileName
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Zа-яА-ЯёЁ0-9._-]/g, '')
    .replace(/^[-_.]+|[-_.]+$/g, '')
}

// const folderPath = path.join(os.homedir(), 'Downloads/E-Moliya')

// const logMessage = (message: any) => {
//   const filePath = path.join(folderPath, 'log.txt')
//   fs.appendFileSync(filePath, `${new Date().toISOString()} - ${message}\n`)
// }

if (import.meta.env.DEV) {
  dotenv.config()
}

const CHECK_UPDATES_INTERVAL = 30 * 1000

const programFilesPath =
  os.arch() === 'x64' ? process.env['ProgramFiles'] : process.env['ProgramFiles(x86)']
const zarplataPath = path.join(programFilesPath || 'C:\\Program Files', 'ISH_HAQQI\\ISH_HAQQI')
const url =
  import.meta.env.VITE_MODE === 'staging'
    ? 'https://nafaqa.fizmasoft.uz'
    : import.meta.env.VITE_MODE === 'region'
      ? 'http://10.50.0.140:4001'
      : 'http://10.50.0.140:4005'

const autoUpdater = new NsisUpdater({
  provider: 'generic',
  url
})

function createWindow(route: string = '', floating: boolean = false): BrowserWindow {
  // Create the browser window.
  // width and height of the window
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  const win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    minWidth: 1400,
    minHeight: height / 2,
    ...(process.platform === 'linux'
      ? { icon: import.meta.env.VITE_MODE === 'prod' ? icon : iconDev }
      : { icon: import.meta.env.VITE_MODE === 'prod' ? icon : iconDev }),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: true // needed for devtools extension to work
    }
  })
  if (floating) {
    win.setSize(width - 100, height - 100)
    win.center()
  } else {
    win.maximize()
  }

  win.on('ready-to-show', async () => {
    win.show()
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.

  const params = new URLSearchParams()
  params.set('route', route)

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'] + `?${params.toString()}`)
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'), {
      search: params.toString()
    })
  }

  windows.push(win)

  win.on('closed', () => {
    windows = windows.filter((w) => w !== win)
  })

  return win
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
  async (_event, { fileName, fileData }: SaveFileArgs): Promise<SaveFileResponse> => {
    const folderPath = path.join(os.homedir(), 'Downloads/E-Moliya')
    const filePath = path.join(folderPath, normalizeFileName(fileName))

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true })
      console.log(`created folder ${folderPath}`)
    }

    fs.writeFileSync(filePath, Buffer.from(fileData))
    console.log(`file saved to ${filePath}`)

    try {
      const result = await shell.openPath(filePath)

      if (result) {
        console.error('Failed to open file:', result)
        shell.showItemInFolder(filePath)
        throw new Error(`Failed to open file: ${result}`)
      }

      console.log('File opened sucessfully', filePath)
    } catch (err) {
      console.error('Failed to open file:', err)
      shell.showItemInFolder(filePath)
      throw new Error(`Failed to open file: ${err}`)
    }

    const stats = fs.statSync(filePath)
    return {
      filePath,
      fileName: path.basename(filePath),
      fileSize: stats.size,
      downloadedAt: stats.birthtime
    }
  }
)

ipcMain.handle('open-file', async (_event, filePath: string) => {
  try {
    const result = await shell.openPath(filePath)

    if (result) {
      console.error('Failed to open file:', result)
      shell.showItemInFolder(filePath)
      throw new Error(`Failed to open file: ${result}`)
    }

    console.log('File opened sucessfully', filePath)
  } catch (err) {
    console.error('Failed to open file:', err)
    shell.showItemInFolder(filePath)
    throw new Error(`Failed to open file: ${err}`)
  }
})

ipcMain.handle('open-file-in-folder', async (_event, filePath: string) => {
  shell.showItemInFolder(filePath)
})

ipcMain.handle(
  'open-route-new-window',
  async (_event, { route, localStorage, sessionStorage }: OpenRouteNewWindowArgs) => {
    const win = createWindow(route, true)
    win.webContents.on('did-finish-load', () => {
      Promise.all([
        win.webContents.executeJavaScript(
          `Object.entries(${JSON.stringify(localStorage)}).forEach(([key, value]) => localStorage.setItem(key, value));`
        ),
        win.webContents.executeJavaScript(
          `Object.entries(${JSON.stringify(sessionStorage)}).forEach(([key, value]) => sessionStorage.setItem(key, value));`
        )
      ]).then(() => {
        win.webContents.send('rehydrate')
      })
    })
  }
)

ipcMain.handle('open-zarplata', () => {
  return shell.openPath(zarplataPath)
})

ipcMain.handle('get-version', () => app.getVersion())
ipcMain.handle('set-zoom-factor', (e, factor) => {
  e.sender.setZoomFactor(factor)
})
ipcMain.handle('get-zoom-factor', (e) => {
  return e.sender.getZoomFactor()
})

ipcMain.handle('ping-internet', () => {
  return new Promise<boolean>((resolve) =>
    exec('ping google.com', (error, _, stderr) => {
      if (error || stderr) {
        resolve(false)
        return
      }
      resolve(true)
    })
  )
})
ipcMain.handle('ping-vpn', () => {
  return new Promise<boolean>((resolve) =>
    exec('ping 10.50.0.140', (error, _, stderr) => {
      if (error || stderr) {
        resolve(false)
        return
      }
      resolve(true)
    })
  )
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
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

  if (import.meta.env.DEV) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .catch((err) => console.log('Error installing React DevTools:', err))
      .then(() => console.log('React DevTools installed'))
  }

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

  if (interval) {
    clearInterval(interval)
  }

  interval = setInterval(() => {
    autoUpdater.checkForUpdates()
  }, CHECK_UPDATES_INTERVAL)
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
  if (interval) {
    clearInterval(interval)
  }
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
