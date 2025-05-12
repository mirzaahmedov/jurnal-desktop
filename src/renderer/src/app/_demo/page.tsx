// import OrganSaldoPage from './saldo/page'
import { Printer } from '../../common/components/printer'

const DemoPage = () => {
  return (
    <Printer filename="demo.pdf">
      {({ ref, print }) => (
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
    </Printer>
  )
}

export default DemoPage
