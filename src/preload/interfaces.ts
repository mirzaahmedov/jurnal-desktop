export interface SaveFileArgs {
  fileName: string
  fileData: ArrayBuffer
}
export interface SaveFileResponse {
  filePath: string
  fileName: string
  fileSize: number
  downloadedAt: Date
}

export interface OpenRouteNewWindowArgs {
  route: string
  localStorage: Record<string, string>
  sessionStorage: Record<string, string>
}
