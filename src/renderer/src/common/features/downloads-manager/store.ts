import { create } from 'zustand'

export interface DownloadedFile {
  name: string
  path: string
  size: number
  downloadedAt: Date
}

export interface DownloadsManagerStore {
  files: DownloadedFile[]
  addFile: (file: DownloadedFile) => void
  removeFile: (filePath: string) => void
  clearFiles: () => void
}

export const useDownloadsManagerStore = create<DownloadsManagerStore>((set) => ({
  files: [],
  addFile: (file: DownloadedFile) =>
    set((state) => ({
      files: [...state.files.filter((prev) => prev.path !== file.path), file]
    })),
  removeFile: (filePath: string) =>
    set((state) => ({
      files: state.files.filter((file) => file.path !== filePath)
    })),
  clearFiles: () =>
    set(() => ({
      files: []
    }))
}))
