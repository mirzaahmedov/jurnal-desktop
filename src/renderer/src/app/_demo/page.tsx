import { type FC, MutableRefObject, RefObject, useMemo, useRef } from 'react'

import { AllCommunityModule, type ColDef, ModuleRegistry } from 'ag-grid-community'
import { AgGridReact, type AgGridReactProps, type CustomCellEditorProps } from 'ag-grid-react'
import { cva } from 'class-variance-authority'
import {
  type ArrayPath,
  Controller,
  type FieldValues,
  type UseFormReturn,
  useFieldArray,
  useForm
} from 'react-hook-form'

import { NumericInput } from '@/common/components'
import { cn } from '@/common/lib/utils'

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
        components={{
          textEditor: textEditor,
          numberEditor: numberEditor
        }}
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
  const fields = useFieldArray({
    control: form.control,
    name: arrayField
  })

  const rowData = useMemo(() => {
    return fields.fields.map((field, index) => ({
      __originalIndex: index,
      ...field
    }))
  }, [fields])

  const columns = useMemo<ColDef[]>(
    () => [
      {
        pinned: 'left',
        field: 'rowIndex',
        headerName: '',
        width: 100,
        cellRenderer: (params) => params.data?.__originalIndex + 1
      },
      ...(columnDefs ?? [])
    ],
    [columnDefs]
  )

  return (
    <AgGridReact
      {...props}
      components={{
        textEditor: textEditor,
        numberEditor: numberEditor
      }}
      columnDefs={columns}
      defaultColDef={{
        sortable: false
      }}
      rowData={rowData}
      context={{
        form,
        onValueEdited
      }}
    />
  )
}

export interface EditorProps extends CustomCellEditorProps {
  originalIndex: number
  form: UseFormReturn<any>
  className?: string
  readonly?: boolean
  disabled?: boolean
  inputRef: MutableRefObject<HTMLInputElement | undefined>
}
export const createEditor = (comp: FC<EditorProps>): FC<CustomCellEditorProps> => {
  return (props) => {
    const form = props.context?.form
    const originalIndex = props.data?.__originalIndex

    const inputRef = useRef<HTMLInputElement>()

    return comp({
      ...props,
      inputRef,
      form,
      originalIndex
    })
  }
}

export const inputVariants = cva('bg-transparent w-full h-full px-4 focus:outline-none')

export const textEditor = createEditor(
  ({ form, inputRef, originalIndex, colDef, disabled, readonly, className }) => (
    <Controller
      name={`items.${originalIndex}.${colDef.field}`}
      control={form.control}
      render={({ field }) => (
        <input
          {...field}
          className={cn(inputVariants(), className)}
          disabled={disabled}
          readOnly={readonly}
          ref={(e) => {
            field.ref(e)
          }}
        />
      )}
    />
  )
)

export const numberEditor = createEditor(
  ({ form, originalIndex, colDef, disabled, readonly, className, context }) => {
    return (
      <Controller
        name={`items.${originalIndex}.${colDef.field}`}
        control={form.control}
        render={({ field }) => (
          <NumericInput
            {...field}
            customInput={undefined}
            value={field.value ?? 0}
            onChange={undefined}
            onValueChange={(values, event) => {
              if (event.source === 'event') {
                context?.onValueEdited?.(originalIndex, colDef.field)
              }
              field.onChange(values.value ?? 0)
            }}
            className={cn(inputVariants(), className)}
            disabled={disabled}
            readOnly={readonly}
          />
        )}
      />
    )
  }
)

export default DemoPage
