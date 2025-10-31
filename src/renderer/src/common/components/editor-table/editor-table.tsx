import type { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community'

import {
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { AgGridReact, type AgGridReactProps, type CustomCellRendererProps } from 'ag-grid-react'
import { CircleMinus, PlusCircle } from 'lucide-react'
import {
  type ArrayPath,
  type FieldValues,
  type UseFormReturn,
  useFieldArray
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { numberCell } from './cells/number'
import { numberEditor } from './editors/number'
import { smetaEditor } from './editors/smeta'
import { textEditor } from './editors/text'

ModuleRegistry.registerModules([AllCommunityModule])

export interface EditorTableProps<T extends FieldValues, F extends ArrayPath<T>>
  extends AgGridReactProps {
  api?: Ref<GridApi | undefined>
  withCreateButton?: boolean
  withDeleteButton?: boolean
  form: UseFormReturn<T>
  arrayField: F
  onValueEdited?: (rowIndex: number, field: keyof T[F][number] & string) => void
  initialRowValues?: T[F]
}
export const EditorTable = <T extends FieldValues = any, F extends ArrayPath<T> = ArrayPath<T>>({
  api,
  withCreateButton,
  withDeleteButton,
  form,
  arrayField,
  columnDefs,
  onValueEdited,
  initialRowValues,
  ...props
}: Omit<EditorTableProps<T, F>, 'rowData' | 'onGridReady'>) => {
  const { t } = useTranslation()

  const [gridApi, setGridApi] = useState<GridApi>()

  const gridContainer = useRef<HTMLDivElement>(null)
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

  const columns = useMemo<ColDef<any>[]>(() => {
    const updatedColumns = [
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
    ]
    if (withDeleteButton) {
      updatedColumns.push({
        pinned: 'right',
        field: 'actions',
        headerName: '',
        width: 100,
        cellRenderer: (props: CustomCellRendererProps) => {
          return (
            <button
              type="button"
              onClick={() => {
                const rowIndex = props.data?.__originalIndex
                rowFields.remove(rowIndex)
                setTimeout(() => {
                  if (!gridApi) return
                  gridApi.ensureIndexVisible(rowIndex, 'bottom')
                }, 0)
              }}
              className="align-middle"
            >
              <CircleMinus className="btn-icon text-red-400" />
            </button>
          )
        }
      })
    }
    return updatedColumns
  }, [columnDefs, rowFields.remove, withDeleteButton, gridApi])

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

  useImperativeHandle(api, () => {
    return gridApi
  }, [gridApi])

  const onGridReady = useCallback((event: GridReadyEvent) => {
    setGridApi(event.api)
  }, [])

  return (
    <div
      ref={gridContainer}
      className="h-full flex flex-col"
    >
      <AgGridReact
        {...props}
        onGridReady={onGridReady}
        rowSelection="single"
        enableCellTextSelection={true}
        suppressScrollOnNewData={true}
        components={components}
        columnDefs={columns}
        defaultColDef={defaultColumnDefs}
        rowData={rowData}
        context={context}
        className="flex-1"
      />
      {withCreateButton ? (
        <button
          className="w-full h-10 bg-gray-100 border-b flex items-center justify-center gap-1.5 text-brand"
          type="button"
          onClick={() => {
            rowFields.append(initialRowValues ?? ({} as any))
            setTimeout(() => {
              if (!gridApi) return
              const lastRowIndex = gridApi.getDisplayedRowCount() - 1
              gridApi.ensureIndexVisible(lastRowIndex, 'bottom')
            }, 0)
          }}
        >
          <PlusCircle className="btn-icon" />
          <span className="text-sm font-semibold">{t('add')}</span>
        </button>
      ) : null}
    </div>
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
