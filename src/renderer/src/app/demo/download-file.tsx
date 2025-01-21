import { Button } from '@renderer/common/components/ui/button'
import type { ButtonProps } from '@renderer/common/components/ui/button'
import { Download } from 'lucide-react'
import { LoadingSpinner } from '@renderer/common/components/loading'
import { http } from '@renderer/common/lib/http'
import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'

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
  const { mutate: downloadDocument, isPending: isDownloadingDocument } = useMutation({
    async mutationFn() {
      const res = await http.get(url, {
        responseType: 'arraybuffer',
        params
      })
      window.downloader.saveFile(res.data, fileName)
    }
  })

  useEffect(() => {
    window.electron.ipcRenderer.on('log', (args) => {
      console.log(args)
    })
  }, [])

  return (
    <Button
      variant="ghost"
      disabled={isDownloadingDocument}
      onClick={() => downloadDocument()}
      {...props}
    >
      {isDownloadingDocument ? (
        <>
          <LoadingSpinner className="btn-icon icon-start" />
          Загрузка
        </>
      ) : (
        <>
          <Download className="btn-icon icon-start !size-4" />
          {buttonText}
        </>
      )}
    </Button>
  )
}
