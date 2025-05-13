import { type ReactNode, type RefObject, useRef } from 'react'

import html2pdf from 'html2pdf.js'

export interface PrinterProps {
  filename: string
  orientation?: 'portrait' | 'landscape'
  children: (props: { ref: RefObject<HTMLDivElement>; print: VoidFunction }) => ReactNode
}
export const Printer = ({ filename, children, orientation = 'landscape' }: PrinterProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const print = async () => {
    if (ref.current) {
      const ext = filename.split('.').pop()
      const basename = filename.split('.').slice(0, -1).join('.')

      filename = `${basename}-${new Date().toLocaleTimeString('ru-RU').replace(/\./g, '-')}.${ext}`

      const blob = await html2pdf()
        .from(ref.current)
        .set({
          margin: 0,
          filename,
          html2canvas: {
            scale: 1,
            scrollY: 0,
            onclone: (clonedDoc: Document) => {
              const clonedElement = clonedDoc.getElementById('capture')
              clonedElement?.querySelectorAll<HTMLElement>('*').forEach((el) => {
                if (el.scrollHeight > el.clientHeight) {
                  el.style.height = el.scrollHeight + 'px'
                  el.style.overflow = 'visible'
                }
              })
            }
          },
          jsPDF: { unit: 'pt', format: 'letter', orientation }
        })
        .outputPdf('blob')

      window.downloader.saveFile({
        fileData: await blob.arrayBuffer(),
        fileName: filename
      })
    }
  }

  return children({ ref, print })
}
