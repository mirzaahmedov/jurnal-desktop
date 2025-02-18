import { PDFViewer } from '@react-pdf/renderer'

import { PorucheniyaPDFDocument } from './Porucheniya'
import { data } from './data'

export const DemoPorucheniya = () => {
  return (
    <PDFViewer style={{ width: '100%', height: '100%' }}>
      <PorucheniyaPDFDocument {...data} />
    </PDFViewer>
  )
}
