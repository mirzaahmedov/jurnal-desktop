import { useState } from 'react'

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { useForm } from 'react-hook-form'

import { Button } from '@/common/components/jolly/button'

import { AgGridTable, TextFilterComponent } from './ag-grid-table'
import { TextEditor } from './components/text-editor'

const data = {
  firstName: 'John',
  lastName: 'Doe',
  name: 'John Doe',
  address: '123 Main St, City, Country'
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
            const data = node.data as { name: string }
            return Boolean(data?.name)
          }}
          columnDefs={[
            {
              field: 'originalIndex',
              headerName: '#',
              valueGetter: (params) => {
                return params.data?._originalIndex + 1
              }
            },
            {
              field: 'name',
              headerName: 'Name',
              filter: {
                component: TextFilterComponent
              },
              sortable: true,
              editable: true,
              cellEditor: TextEditor,
              flex: 1
            },
            {
              field: 'firstName',
              headerName: 'First Name',
              editable: true,
              cellEditor: TextEditor,
              flex: 1
            },
            {
              field: 'lastName',
              headerName: 'Last Name',
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
