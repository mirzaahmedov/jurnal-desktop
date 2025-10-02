import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { useForm } from 'react-hook-form'

import { EditorTable } from './components/editor-table'

ModuleRegistry.registerModules([AllCommunityModule])

interface IRow {
  name: string
  age: number
}

const DemoPage = () => {
  const form = useForm<{
    items: IRow[]
  }>({
    defaultValues: {
      items: [
        { name: 'Item 1', age: 10 },
        { name: 'Item 2', age: 20 },
        { name: 'Item 3', age: 40 }
      ]
    }
  })

  return (
    <div className="flex-1">
      <EditorTable
        form={form}
        arrayField="items"
        columnDefs={[
          {
            field: 'name',
            cellRenderer: 'textEditor'
          },
          {
            field: 'age',
            cellRenderer: 'numberEditor'
          }
        ]}
        className="h-full"
      />
    </div>
  )
}

export default DemoPage
