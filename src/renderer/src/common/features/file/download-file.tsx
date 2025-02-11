import type { ButtonProps } from '@renderer/common/components/ui/button'

import { Spinner } from '@renderer/common/components/loading'
import { Button } from '@renderer/common/components/ui/button'
import { http } from '@renderer/common/lib/http'
import { useMutation } from '@tanstack/react-query'
import { Download } from 'lucide-react'

export type DownloadFileProps = ButtonProps & {
  url: string
  params: Record<string, any>
  fileName: string
  buttonText?: string
}
export const DownloadFile = ({
  url,
  params,
  fileName,
  buttonText,
  ...props
}: DownloadFileProps) => {
  const { mutate: downloadFile, isPending: isDownloadingFile } = useMutation({
    async mutationFn() {
      const res = await http.get(url, {
        responseType: 'arraybuffer',
        params
      })
      const [name, ext] = fileName.split('.')
      window.downloader.saveFile(res.data, `${name}___${Date.now()}.${ext}`)
    }
  })

  return (
    <Button
      variant="ghost"
      disabled={isDownloadingFile}
      onClick={() => downloadFile()}
      {...props}
    >
      {isDownloadingFile ? (
        <>
          <Spinner className="btn-icon icon-start" />
          Загрузка
        </>
      ) : (
        <>
          <Download className="btn-icon icon-start !size-4" />
          <span className="titlecase">{buttonText}</span>
        </>
      )}
    </Button>
  )
}
