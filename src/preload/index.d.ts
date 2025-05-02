import type { SaveFileArgs, SaveFileResponse } from './interfaces'
import type { ElectronAPI } from '@electron-toolkit/preload'

interface Downloader {
  saveFile(args: SaveFileArgs): Promise<SaveFileResponse>
  openFile(filePath: string): Promise<void>
  openFileInFolder(filePath: string): Promise<void>
}
declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      quitAndInstall(): void
      getZoomFactor(): Promise<number>
      setZoomFactor(factor: number): void
      openZarplata(): Promise<string>
    }
    downloader: Downloader
  }
}
