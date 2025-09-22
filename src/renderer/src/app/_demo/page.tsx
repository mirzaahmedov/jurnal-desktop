import { useState } from 'react'

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { useForm } from 'react-hook-form'

import { Button } from '@/common/components/jolly/button'

import { AgGridTable } from './ag-grid-table'
import { TextEditor } from './components/text-editor'

const data = {
  income: 1000,
  expense: 3000,
  summa: 4000,
  name: 'Testing'
}

ModuleRegistry.registerModules([AllCommunityModule])

const DemoPage = () => {
  const [hideEmptyRows, setEmptyRowsHidden] = useState(false)

  const form = useForm({
    defaultValues: {
      rows: Array.from({ length: 20000 }).map((_, index) => ({
        ...data,
        name: data.name + ' ' + (index + 1)
      }))
    }
  })

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="p-5">
        <Button
          onClick={() => {
            setEmptyRowsHidden((prev) => !prev)
          }}
        >
          {hideEmptyRows ? 'Show' : 'Hide'} empty rows
        </Button>
      </div>
      <div className="flex-1">
        <AgGridTable
          form={form}
          arrayName="rows"
          isExternalFilterPresent={() => hideEmptyRows}
          doesExternalFilterPass={(node) => {
            if (!hideEmptyRows) {
              return true
            }
            const { data } = node
            return !!data.name
          }}
          columnDefs={[
            {
              field: 'name',
              headerName: 'Name',
              editable: true,
              cellEditor: TextEditor,
              flex: 1
            }
          ]}
        />
      </div>
    </div>
  )
}

export default DemoPage
