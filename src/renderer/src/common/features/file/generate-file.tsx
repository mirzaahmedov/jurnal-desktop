import { Button } from '@renderer/common/components/ui/button'
import type { ButtonProps } from '@renderer/common/components/ui/button'
import type { DocumentProps } from '@react-pdf/renderer'
import { LoadingSpinner } from '@renderer/common/components/loading'
import { Printer } from 'lucide-react'
import type { ReactElement } from 'react'
import { pdf } from '@react-pdf/renderer'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '@/common/hooks/use-toast'

export type GenerateFileProps = ButtonProps & {
  children: ReactElement<DocumentProps>
  fileName: string
  buttonText: string
}
export const GenerateFile = ({ children, fileName, buttonText, ...props }: GenerateFileProps) => {
  const { toast } = useToast()
  const { mutate: generateDocument, isPending: isGeneratingDocument } = useMutation({
    mutationFn: async () => {
      const blob = await pdf(children).toBlob()
      const buf = await blob.arrayBuffer()
      window.downloader.saveFile(buf, fileName)
    },
    onError(error) {
      toast({
        title: 'Ошибка при генерации файла',
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => generateDocument()}
      disabled={isGeneratingDocument}
      {...props}
    >
      {isGeneratingDocument ? (
        <>
          <LoadingSpinner className="btn-icon icon-start" />
          Загрузка
        </>
      ) : (
        <>
          <Printer className="btn-icon icon-start !size-4" />
          {buttonText}
        </>
      )}
    </Button>
  )
}
