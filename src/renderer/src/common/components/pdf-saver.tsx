import { type ReactNode, type RefObject, useRef } from 'react'

import { useMutation } from '@tanstack/react-query'
import html2pdf from 'html2pdf.js'
import { t } from 'i18next'
import { toast } from 'react-toastify'

export interface PDFSaverProps {
  filename: string
  format?: 'a4' | 'letter' | [number, number]
  orientation?: 'portrait' | 'landscape'
  children: (props: {
    ref: RefObject<HTMLDivElement>
    savePDF: VoidFunction
    isPending: boolean
  }) => ReactNode
}
export const PDFSaver = ({
  filename,
  children,
  orientation = 'portrait',
  format = 'a4'
}: PDFSaverProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const { mutate: savePDF, isPending } = useMutation({
    mutationFn: async () => {
      if (ref.current) {
        const ext = filename.split('.').pop()
        const basename = filename.split('.').slice(0, -1).join('.')

        filename = `${basename}-${new Date().toLocaleTimeString('ru-RU').replace(/\./g, '-')}.${ext}`

        const blob: Blob = await html2pdf()
          .from(ref.current)
          .set({
            margin: 5,
            filename,
            autoPaging: 'text',
            html2canvas: {
              scale: 2,
              scrollY: 0,
              onclone: (clonedDoc: Document) => {
                clonedDoc.documentElement.style.fontSize = '12px'

                const hiddenElements = clonedDoc?.querySelectorAll('.pdf-hidden')
                hiddenElements?.forEach((el) => {
                  el.remove()
                })

                const textareas = clonedDoc.querySelectorAll('textarea')

                textareas.forEach((ta) => {
                  const div = clonedDoc.createElement('div')

                  div.textContent = ta.value
                  div.className = ta.className

                  ta.replaceWith(div)
                })
              }
            },
            jsPDF: {
              unit: 'mm',
              format,
              orientation
            }
          })
          .outputPdf('blob')

        window.downloader.saveFile({
          fileData: await blob.arrayBuffer(),
          fileName: filename
        })
      }
    },
    onError: (error) => {
      console.error('Error saving PDF:', error)
      toast.error(t('something-went-wrong'))
    }
  })

  return children({ ref, savePDF, isPending })
}
