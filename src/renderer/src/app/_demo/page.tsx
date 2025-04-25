import type { EditableTableMethods } from '@/common/components/editable-table'

import { type KeyboardEvent, useRef } from 'react'

import { useForm, useWatch } from 'react-hook-form'

import {
  type EditableColumnDef,
  EditableTableAlt,
  type EditableTableFooterProps,
  EditableTableRowRenderer
} from '@/common/components/editable-table-alt'
import { createTextEditor } from '@/common/components/editable-table-alt/editors'
import { SearchInput } from '@/common/components/search-input'

type FormValues = {
  childs: Array<{
    name: number
  }>
}

const columns: EditableColumnDef<FormValues, 'childs'>[] = [
  {
    key: 'name',
    width: '100%',
    Editor: createTextEditor({})
  }
]
const childs = Array.from({ length: 2000 }, (_, i) => ({
  name: i + 1
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
          row.name.toString()?.toLowerCase()?.includes(value?.toLowerCase())
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
          footer={DemoTableFooter}
        />
      </div>
    </div>
  )
}

const DemoTableFooter = ({ form, dataColumns }: EditableTableFooterProps<FormValues, 'childs'>) => {
  const rows = useWatch({
    control: form.control,
    name: 'childs'
  })

  const total = rows.reduce((acc, row) => {
    if (row.name) {
      acc += row.name
    }
    return acc
  }, 0)

  const row = {
    id: String(rows.length),
    name: String(total)
  }

  return (
    <EditableTableRowRenderer
      index={rows.length}
      type="footer"
      highlightedRow={{ current: null }}
      columnDefs={columns}
      row={row}
      rows={[...rows, row]}
      dataColumns={dataColumns}
      className="[&_input]:font-bold"
    />
  )
}

export default DemoPage
