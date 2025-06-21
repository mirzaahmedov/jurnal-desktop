import { PDFViewer } from '@react-pdf/renderer'

import { data } from './data'
import { PorucheniyaPDFDocument } from './porucheniya'

const DemoPorucheniya = () => {
  return (
    <PDFViewer style={{ width: '100%', height: '100%' }}>
      <PorucheniyaPDFDocument {...data} />
    </PDFViewer>
  )
}

export default DemoPorucheniya
