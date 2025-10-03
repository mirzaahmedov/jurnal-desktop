import type { ColDef } from 'ag-grid-community'

import { useMemo } from 'react'

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { AgGridReact, type AgGridReactProps } from 'ag-grid-react'
import {
  type ArrayPath,
  type FieldValues,
  type UseFormReturn,
  useFieldArray
} from 'react-hook-form'

import { numberCell } from './cells/number'
import { numberEditor } from './editors/number'
import { textEditor } from './editors/text'

ModuleRegistry.registerModules([AllCommunityModule])

export interface EditorTableProps<T extends FieldValues, F extends ArrayPath<T>>
  extends AgGridReactProps {
  form: UseFormReturn<T>
  arrayField: F
  onValueEdited?: (rowIndex: number, field: keyof T[F][number] & string) => void
  onCreate?: () => void
  onRemove?: (index: number) => void
}
export const EditorTable = <T extends FieldValues = any, F extends ArrayPath<T> = ArrayPath<T>>({
  form,
  arrayField,
  columnDefs,
  onValueEdited,
  ...props
}: Omit<EditorTableProps<T, F>, 'rowData'>) => {
  const rowFields = useFieldArray({
    control: form.control,
    name: arrayField
  })

  const rowData = useMemo(() => {
    return rowFields.fields.map((field, index) => ({
      __originalIndex: index,
      ...field
    }))
  }, [rowFields.fields])

  const columns = useMemo<ColDef<any>[]>(
    () => [
      {
        pinned: 'left',
        field: 'rowIndex',
        headerName: '',
        width: 100,
        cellRenderer: (params) => {
          if (params.node?.rowPinned === 'bottom') {
            return ''
          }
          return params.data?.__originalIndex + 1
        }
      } satisfies ColDef<any>,
      ...(columnDefs ?? [])
    ],
    [columnDefs]
  )

  return (
    <AgGridReact
      {...props}
      rowSelection="single"
      enableCellTextSelection={true}
      components={{
        textEditor: textEditor,
        numberEditor: numberEditor,
        numberCell: numberCell
      }}
      columnDefs={columns}
      defaultColDef={{
        sortable: false
      }}
      rowData={rowData}
      context={{
        form,
        arrayField,
        onValueEdited
      }}
    />
  )
}
