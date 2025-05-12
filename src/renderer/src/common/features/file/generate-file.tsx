import type { DocumentProps } from '@react-pdf/renderer'
import type { ReactElement } from 'react'

import { pdf } from '@react-pdf/renderer'
import { useMutation } from '@tanstack/react-query'
import { t } from 'i18next'
import { Printer } from 'lucide-react'
import { toast } from 'react-toastify'

import { Button, type ButtonProps } from '@/common/components/jolly/button'

import { useDownloadsManagerStore } from '../downloads-manager'

export type GenerateFileProps = ButtonProps & {
  children: ReactElement<DocumentProps>
  fileName: string
  buttonText: string
}
export const GenerateFile = ({
  children,
  fileName,
  buttonText,
  isPending,
  ...props
}: GenerateFileProps) => {
  const addFile = useDownloadsManagerStore((store) => store.addFile)

  const { mutate: generate, isPending: isGeneratingDocument } = useMutation({
    mutationFn: async () => {
      const blob = await pdf(children).toBlob()
      const buf = await blob.arrayBuffer()

      const [name, ext] = fileName.split('.')
      const file = await window.downloader.saveFile({
        fileData: buf,
        fileName: `${name}___${Date.now()}.${ext}`
      })

      addFile({
        name: file.fileName,
        path: file.filePath,
        size: file.fileSize,
        downloadedAt: file.downloadedAt
      })
    },
    onError(error) {
      toast.error(`${t('error_generating_file')}: ${error.message}`)
    }
  })

  return (
    <Button
      type="button"
      variant="ghost"
      onPress={() => generate()}
      IconStart={Printer}
      isPending={isPending || isGeneratingDocument}
      {...props}
    >
      {buttonText}
    </Button>
  )
}
