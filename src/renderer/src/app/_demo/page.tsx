// import OrganSaldoPage from './saldo/page'
import { PDFSaver } from '../../common/components/pdf-saver'

const DemoPage = () => {
  return (
    <PDFSaver filename="demo.pdf">
      {({ ref, savePDF: print }) => (
        <div
          ref={ref}
          className="p-4"
        >
          <h1 className="text-2xl font-bold">Demo Page</h1>
          <p>This is a demo page for printing.</p>
          <button
            onClick={print}
            className="mt-4 bg-blue-500 text-white p-2 rounded"
          >
            Print
          </button>
        </div>
      )}
    </PDFSaver>
  )
}

export default DemoPage
