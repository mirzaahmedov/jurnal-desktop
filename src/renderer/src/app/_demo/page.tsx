import { PDFViewer } from '@react-pdf/renderer'

import { AktPriyomReport } from './akt-priyom/akt-priyom'

const DemoPage = () => {
  return (
    <div className="p-10 flex-1 flex flex-col gap-5 overflow-y-auto scrollbar">
      <PDFViewer className="h-full">
        <AktPriyomReport
          docNum="4F000"
          docDate="10-10-2024"
          dovernost="F012999"
          headerText="Hello World"
          podpises={[]}
          products={[]}
        />
      </PDFViewer>
    </div>
  )
}

export default DemoPage
