import { ElectronAPI } from '@electron-toolkit/preload'

interface Downloader {
  saveFile(fileData: ArrayBuffer, fileName: string): string
}
declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      quitAndInstall(): void
    }
    downloader: Downloader
  }
}
