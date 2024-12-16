import type { ButtonProps } from './ui/button'

import { Button } from './ui/button'
import { Download } from 'lucide-react'
import { LoadingSpinner } from './loading'
import { useMutation } from '@tanstack/react-query'
import { http } from '@/common/lib/http'
import { saveAs } from 'file-saver'

type DownloadDocumentButtonProps = ButtonProps & {
  url: string
  params: Record<string, any>
  fileName: string
  buttonText?: string
}
const DownloadDocumentButton = ({
  url,
  params,
  fileName,
  buttonText,
  ...props
}: DownloadDocumentButtonProps) => {
  const { mutate: downloadDocument, isPending: isDownloadingDocument } = useMutation({
    async mutationFn() {
      const { data } = await http.get(url, {
        responseType: 'blob',
        params
      })
      saveAs(new Blob([data]), fileName)
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
          {buttonText}
        </>
      )}
    </Button>
  )
}

export { DownloadDocumentButton }
