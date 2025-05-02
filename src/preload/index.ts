import type { SaveFileArgs } from './interfaces'

import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  quitAndInstall() {
    ipcRenderer.send('restart')
  },
  setZoomFactor(factor: number) {
    ipcRenderer.invoke('set-zoom-factor', factor)
  },
  getZoomFactor() {
    return ipcRenderer.invoke('get-zoom-factor')
  },
  openZarplata() {
    return ipcRenderer.invoke('open-zarplata')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('downloader', {
      saveFile: ({ fileName, fileData }: SaveFileArgs) =>
        ipcRenderer.invoke('save-file', { fileName, fileData }),
      openFile: (filePath: string) => ipcRenderer.invoke('open-file', filePath),
      openFileInFolder: (filePath: string) => ipcRenderer.invoke('open-file-in-folder', filePath)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
