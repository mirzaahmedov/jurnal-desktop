import type { ReactElement } from 'react'
import type { ButtonProps } from './ui/button'
import type { DocumentProps } from '@react-pdf/renderer'

import { LoadingSpinner } from './loading'
import { Printer } from 'lucide-react'
import { Button } from './ui/button'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '@/common/hooks/use-toast'
import { saveAs } from 'file-saver'
import { pdf } from '@react-pdf/renderer'

type GenerateDocumentButtonProps = ButtonProps & {
  children: ReactElement<DocumentProps>
  fileName: string
  buttonText: string
}
const GenerateDocumentButton = ({
  children,
  fileName,
  buttonText,
  ...props
}: GenerateDocumentButtonProps) => {
  const { toast } = useToast()
  const { mutate: generateDocument, isPending: isGeneratingDocument } = useMutation({
    mutationFn: async () => {
      const blob = await pdf(children).toBlob()
      saveAs(blob, fileName)
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

export { GenerateDocumentButton }
