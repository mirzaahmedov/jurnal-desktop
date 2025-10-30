import type { ColDef, GridApi } from 'ag-grid-community'

import { useEffect, useMemo, useState } from 'react'

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
import { smetaEditor } from './editors/smeta'
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
  const [gridApi, setGridApi] = useState<GridApi>()

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

  const context = useMemo(
    () => ({
      form,
      arrayField,
      onValueEdited
    }),
    [form, arrayField, onValueEdited]
  )

  useEffect(() => {
    gridApi?.refreshCells({ force: true })
  }, [context, gridApi])

  return (
    <AgGridReact
      {...props}
      onGridReady={(event) => {
        setGridApi(event.api)
        props.onGridReady?.(event)
      }}
      rowSelection="single"
      enableCellTextSelection={true}
      components={components}
      columnDefs={columns}
      defaultColDef={defaultColumnDefs}
      rowData={rowData}
      context={context}
    />
  )
}

export const components = {
  textEditor: textEditor,
  numberEditor: numberEditor,
  smetaEditor: smetaEditor,
  numberCell: numberCell
}

export const defaultColumnDefs: ColDef = {
  sortable: false,
  suppressKeyboardEvent: () => true
}
