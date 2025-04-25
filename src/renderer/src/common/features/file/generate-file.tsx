import type { DocumentProps } from '@react-pdf/renderer'
import type { ReactElement } from 'react'

import { pdf } from '@react-pdf/renderer'
import { useMutation } from '@tanstack/react-query'
import { t } from 'i18next'
import { Loader2, Printer } from 'lucide-react'
import { toast } from 'react-toastify'

import { Button, type ButtonProps } from '@/common/components/jolly/button'

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
  const { mutate: generate, isPending: isGeneratingDocument } = useMutation({
    mutationFn: async () => {
      const blob = await pdf(children).toBlob()
      const buf = await blob.arrayBuffer()

      const [name, ext] = fileName.split('.')
      window.downloader.saveFile(buf, `${name}___${Date.now()}.${ext}`)
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
      isPending={isPending || isGeneratingDocument}
      {...props}
    >
      {isPending || isGeneratingDocument ? (
        <Loader2 className="btn-icon icon-start animate-spin" />
      ) : (
        <Printer className="btn-icon icon-start" />
      )}
      {buttonText}
    </Button>
  )
}
