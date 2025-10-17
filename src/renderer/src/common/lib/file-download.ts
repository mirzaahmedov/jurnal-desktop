import { api } from './http'

export type DownloadFileParams = {
  url: string
  params: Record<string, unknown>
}
export const downloadFile = async ({ url, params }: DownloadFileParams) => {
  const { data } = await api.get(url, {
    responseType: 'blob',
    params
  })
  const urlObject = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  document.body.appendChild(link)
  link.href = urlObject
  link.download = 'report.xlsx'
  link.innerHTML = 'Click here to download the file'
  link.click()
  window.URL.revokeObjectURL(urlObject)
  document.body.removeChild(link)
}
