import type { ButtonProps } from '@/common/components/ui/button'

import { useMutation } from '@tanstack/react-query'
import { Download } from 'lucide-react'

import { Spinner } from '@/common/components/loading'
import { Button } from '@/common/components/ui/button'
import { useSettingsStore } from '@/common/features/settings'
import { http } from '@/common/lib/http'

export type DownloadFileProps = ButtonProps & {
  requireTitle?: boolean
  url: string
  params: Record<string, any>
  fileName: string
  buttonText?: string
}
export const DownloadFile = ({
  requireTitle,
  url,
  params,
  fileName,
  buttonText,
  ...props
}: DownloadFileProps) => {
  const report_title_id = useSettingsStore((store) => store.report_title_id)

  const { mutate: downloadFile, isPending: isDownloadingFile } = useMutation({
    mutationFn: async () => {
      const res = await http.get(url, {
        responseType: 'arraybuffer',
        params
      })
      const [name, ext] = fileName.split('.')
      window.downloader.saveFile(res.data, `${name}___${Date.now()}.${ext}`)
    }
  })

  const handleDownloadFile = () => {
    if (requireTitle && !report_title_id) {
      alert('Пожалуйста, введите название отчета')
    }
    ;() => downloadFile()
  }

  return (
    <Button
      variant="ghost"
      disabled={isDownloadingFile}
      onClick={handleDownloadFile}
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
