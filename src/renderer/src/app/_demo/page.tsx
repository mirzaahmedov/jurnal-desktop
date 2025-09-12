// import { PDFViewer } from '@react-pdf/renderer'
// import { usePodpis } from '@/common/features/podpis'
// import { parseDate } from '@/common/lib/date'
// import { PodpisTypeDocument } from '@/common/models'
// import { useMainSchetQuery } from '../region-spravochnik/main-schet/use-main-schet-query'
// import { workTrip } from './demo'
// import { WorkTripReport } from './work-trip/work-trip'
// const DemoPage = () => {
//   const mainSchetQuery = useMainSchetQuery()
//   const podpis = usePodpis(PodpisTypeDocument.BANK_RASXOD_PORUCHENIYA)
//   return (
//     <div className="flex-1">
//       <PDFViewer className="w-full h-full">
//         <WorkTripReport
//           provodki={workTrip.childs ?? []}
//           roads={workTrip.road ?? []}
//           workerPosition={workTrip.worker.position}
//           workerRank={workTrip.worker.rank ?? ''}
//           workerFIO={workTrip.worker.name}
//           regionName={mainSchetQuery.data?.data?.tashkilot_nomi ?? ''}
//           podpis={podpis}
//           year={parseDate(workTrip.doc_date).getFullYear()}
//         />
//       </PDFViewer>
//     </div>
//   )
// }
// export default DemoPage
import { FC, InputHTMLAttributes } from 'react'

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { AgGridReact, CustomCellEditorProps } from 'ag-grid-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Controller } from 'react-hook-form'

ModuleRegistry.registerModules([AllCommunityModule])

const DemoPage = () => {
  const form = useForm({
    defaultValues: {
      childs: [
        { make: 'Toyota', model: 'Celica', price: 35000 },
        { make: 'Ford', model: 'Mondeo', price: 32000 },
        { make: 'Porsche', model: 'Boxster', price: 72000 }
      ]
    }
  })

  const data = useFieldArray({
    control: form.control,
    name: 'childs'
  })

  return (
    <div className="flex-1">
      <AgGridReact
        className="ag-theme-alpine h-full"
        rowData={data.fields}
        getRowId={(params) => params.data.id}
        columnDefs={[
          {
            field: 'make',
            editable: true,
            cellEditor: RHFCellEditor,
            cellRendererParams: { form },
            cellRenderer: RHFCellEditor,
            cellEditorParams: { form }
          },
          {
            field: 'model',
            editable: true,
            cellEditor: RHFCellEditor,
            cellRendererParams: { form },
            cellRenderer: RHFCellEditor,
            cellEditorParams: { form }
          },
          {
            field: 'price',
            editable: true,
            cellEditor: RHFCellEditor,
            cellRendererParams: { form },
            cellRenderer: RHFCellEditor,
            cellEditorParams: { form }
          }
        ]}
        defaultColDef={{ flex: 1, minWidth: 100 }}
      />
    </div>
  )
}

export interface TextEditorProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string
  onValueChange: (value: string) => void
}
const TextEditor: FC<TextEditorProps> = (props) => {
  const { value, onValueChange, onChange, ...inputProps } = props
  return (
    <input
      type="text"
      value={value ?? ''}
      onChange={(e) => {
        onChange?.(e)
        onValueChange(e.target.value)
      }}
      className="w-full h-full border-none bg-transparent focus:outline-none focus:ring-[2px] ring-brand px-4"
      autoFocus
      {...inputProps}
    />
  )
}

const RHFCellEditor = (props: CustomCellEditorProps) => {
  const { colDef, node, form } = props
  const fieldName = `${colDef.field}`

  return (
    <Controller
      control={form.control}
      name={`childs.${node.rowIndex}.${fieldName}`}
      render={({ field }) => (
        <TextEditor
          value={field.value}
          onValueChange={(val) => {
            field.onChange(val)
          }}
          onBlur={() => {
            props.stopEditing()
          }}
        />
      )}
    />
  )
}

export default DemoPage
