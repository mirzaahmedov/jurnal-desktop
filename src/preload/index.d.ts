import { ElectronAPI } from '@electron-toolkit/preload'

interface Downloader {
  saveFile(fileData: ArrayBuffer, fileName: string): string
}
declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    downloader: Downloader
  }
}
