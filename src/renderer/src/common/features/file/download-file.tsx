import type { ButtonProps } from '@/common/components/jolly/button'

import { useMutation } from '@tanstack/react-query'
import { Download, Loader2 } from 'lucide-react'

import { Button } from '@/common/components/jolly/button'
import { useSettingsStore } from '@/common/features/settings'
import { useToggle } from '@/common/hooks'
import { http } from '@/common/lib/http'

import { SelectReportTitleAlert } from './select-report-title-alert'

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
  const alertToggle = useToggle()
  const report_title_id = useSettingsStore((store) => store.report_title_id)

  const { mutate: downloadFile, isPending: isDownloadingFile } = useMutation({
    mutationFn: async () => {
      try {
        const res = await http.get(url, {
          responseType: 'arraybuffer',
          params
        })
        const [name, ext] = fileName.split('.')
        console.log({ client: window.electron })
        window.downloader.saveFile(res.data, `${name}___${Date.now()}.${ext}`)
      } catch (error) {
        console.log(error)
      }
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const handleDownloadFile = () => {
    if (!report_title_id) {
      alertToggle.open()
      return
    }
    downloadFile()
  }

  return (
    <>
      <Button
        variant="ghost"
        isPending={isDownloadingFile}
        onClick={handleDownloadFile}
        {...props}
      >
        {isDownloadingFile ? (
          <Loader2 className="btn-icon icon-sm icon-start animate-spin" />
        ) : (
          <Download className="btn-icon icon-sm icon-start" />
        )}
        {buttonText}
      </Button>
      <SelectReportTitleAlert
        open={alertToggle.isOpen}
        onOpenChange={alertToggle.setOpen}
      />
    </>
  )
}
