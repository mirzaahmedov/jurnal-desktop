import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'

import { formatNumber } from '@/common/lib/format'

import { NumberEditor } from './components/number-editor'
import { TextEditor } from './components/text-editor'
import { bankRasxodData } from './data'

ModuleRegistry.registerModules([AllCommunityModule])

const DemoPage = () => {
  const form = useForm({
    defaultValues: bankRasxodData
  })

  const dataSource = useFieldArray({
    control: form.control,
    name: 'childs'
  })

  return (
    <div className="flex-1">
      <FormProvider {...form}>
        <AgGridReact
          rowData={dataSource.fields}
          columnDefs={[
            {
              field: 'summa',
              headerName: 'summa',
              editable: true,
              valueFormatter: (params) => formatNumber(params.value),
              cellEditor: NumberEditor
            },
            {
              field: 'schet',
              headerName: 'Schet',
              editable: true,
              cellEditor: TextEditor
            }
          ]}
          defaultColDef={{
            valueParser: (params) => params.newValue
          }}
          containerStyle={{
            height: '100%'
          }}
          context={{
            arrayName: 'childs'
          }}
        />
      </FormProvider>
    </div>
  )
}

export default DemoPage
