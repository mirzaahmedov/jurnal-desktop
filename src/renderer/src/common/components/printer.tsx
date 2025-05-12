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
      const blob = await html2pdf()
        .from(ref.current)
        .set({
          margin: 0,
          filename,
          html2canvas: { scale: 1 },
          jsPDF: { unit: 'pt', format: 'a4', orientation }
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
