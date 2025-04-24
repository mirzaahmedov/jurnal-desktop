import type { EditableTableMethods } from '@/common/components/editable-table'

import { type KeyboardEvent, useRef } from 'react'

import { useForm } from 'react-hook-form'

import { type EditableColumnDef, EditableTableAlt } from '@/common/components/editable-table-alt'
import { createTextEditor } from '@/common/components/editable-table-alt/editors'
import { SearchInput } from '@/common/components/search-input'

const columns: EditableColumnDef<{ name: string }>[] = [
  {
    key: 'name',
    Editor: createTextEditor({
      key: 'name'
    })
  }
]
const childs = Array.from({ length: 2000 }, (_, i) => ({
  name: `name ${i + 1}`
}))

const DemoPage = () => {
  const tableMethods = useRef<EditableTableMethods>(null)

  const form = useForm({
    defaultValues: {
      childs
    }
  })

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault()

      const value = e.currentTarget.value
      if (value.length > 0) {
        const rows = form.getValues('childs')
        const index = rows.findIndex((row) =>
          row.name?.toLowerCase()?.includes(value?.toLowerCase())
        )
        tableMethods.current?.scrollToRow(index)
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-5">
        <SearchInput onKeyDown={handleSearch} />
      </div>
      <div className="flex-1 overflow-hidden">
        <EditableTableAlt
          columnDefs={columns}
          form={form}
          name="childs"
          methods={tableMethods}
        />
      </div>
    </div>
  )
}

export default DemoPage
