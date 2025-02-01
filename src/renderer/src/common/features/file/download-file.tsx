import { LoadingSpinner } from '@renderer/common/components/loading'
import type { ButtonProps } from '@renderer/common/components/ui/button'
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
  const { mutate: downloadDocument, isPending: isDownloadingDocument } = useMutation({
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
          <span className="titlecase">{buttonText}</span>
        </>
      )}
    </Button>
  )
}
