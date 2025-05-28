import { PDFViewer } from '@react-pdf/renderer'

import { SchetFakturaPDF } from '../jur_7/prixod/report/schet-faktura'

const DemoPage = () => {
  return (
    <PDFViewer style={{ flex: 1 }}>
      <SchetFakturaPDF />
    </PDFViewer>
  )
}

export default DemoPage
