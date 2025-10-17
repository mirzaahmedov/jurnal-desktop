import type { ButtonProps } from '@/common/components/jolly/button'
import type { AxiosResponse } from 'axios'

import { useMutation } from '@tanstack/react-query'
import { Download, Loader2 } from 'lucide-react'

import { Button } from '@/common/components/jolly/button'
// import { useSettingsStore } from '@/common/features/settings'
import { useToggle } from '@/common/hooks'
import { api } from '@/common/lib/http'
import { zarplataApiNew } from '@/common/lib/zarplata_new'

import { useDownloadsManagerStore } from '../downloads-manager/store'
import { SelectReportTitleAlert } from './select-report-title-alert'

export type DownloadFileProps = ButtonProps & {
  isZarplata?: boolean
  url: string
  params: Record<string, any>
  fileName: string
  buttonText?: string
}
export const DownloadFile = ({
  isZarplata = false,
  url,
  params,
  fileName,
  buttonText,
  ...props
}: DownloadFileProps) => {
  const alertToggle = useToggle()
  // const report_title_id = useSettingsStore((store) => store.report_title_id)

  const addFile = useDownloadsManagerStore((store) => store.addFile)

  const { mutate: downloadFile, isPending: isDownloadingFile } = useMutation({
    mutationFn: async () => {
      try {
        let res: AxiosResponse<any, any>
        if (isZarplata) {
          res = await zarplataApiNew.get(url, {
            responseType: 'arraybuffer',
            params
          })
        } else {
          res = await api.get(url, {
            responseType: 'arraybuffer',
            params
          })
        }
        const nameParts = fileName.split('.')
        const name = nameParts.slice(0, -1).join('__')
        const ext = nameParts.slice(-1)[0]

        const file = await window.downloader.saveFile({
          fileName: `${name}___${Date.now()}.${ext}`,
          fileData: res.data
        })

        addFile({
          name: file.fileName,
          path: file.filePath,
          size: file.fileSize,
          downloadedAt: file.downloadedAt
        })
      } catch (error) {
        console.log(error)
      }
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const handleDownloadFile = () => {
    // if (!report_title_id) {
    //   alertToggle.open()
    //   return
    // }
    downloadFile()
  }

  return (
    <>
      <Button
        variant="ghost"
        isDisabled={isDownloadingFile}
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
