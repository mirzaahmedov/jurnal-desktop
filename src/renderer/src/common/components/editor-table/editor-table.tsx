import type { ColumnDef } from './types'

import { type Ref, type RefObject, useImperativeHandle, useMemo, useRef } from 'react'

import { Plus } from 'lucide-react'
import {
  Controller,
  type FieldErrors,
  type FieldValues,
  type SetValueConfig,
  type UseFormReturn,
  useFieldArray
} from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'

import { EditorCell } from './components/cell'
import { EditorHeaderCell } from './components/header-cell'
import { flattenColumns, getLeafColumns, getMaximumColumnDepth } from './utils'

export type ArrayPath<T extends object> = {
  [Field in keyof T]: T[Field] extends any[] ? Field : never
}[keyof T]
export type GetFieldType<
  TForm extends FieldValues,
  TName extends ArrayPath<TForm>
> = TForm[TName][number]

export interface TableMethods {
  scrollToRow: (rowIndex: number) => void
}

interface EditableTableProps<
  TForm extends FieldValues,
  TName extends ArrayPath<TForm>,
  TMeta extends object = {}
> {
  form: UseFormReturn<TForm>
  name: TName
  columnDefs: ColumnDef<GetFieldType<TForm, TName>>[]
  defaultValues: GetFieldType<TForm, TName>
  tableRef?: Ref<HTMLDivElement | null>
  methods?: RefObject<TableMethods | null>
  meta?: TMeta
}

export const EditorTable = <TForm extends FieldValues, TName extends ArrayPath<TForm>>({
  form,
  name,
  methods,
  tableRef,
  columnDefs,
  defaultValues
}: EditableTableProps<TForm, TName>) => {
  const ref = useRef<HTMLDivElement>(null)

  const {
    fields: rows,
    append: appendRow,
    remove: removeRow,
    insert: insertRow,
    replace: replaceRows
  } = useFieldArray({
    control: form.control,
    name: name as any
  })
  const { t } = useTranslation()

  useImperativeHandle(tableRef, () => ref.current!)
  useImperativeHandle(methods, () => ({
    scrollToRow: () => {}
  }))

  const leafColumnDefs = useMemo(() => getLeafColumns(columnDefs), [columnDefs])
  const indexDigitsCount = String(rows.length).length
  const maxDepth = useMemo(() => getMaximumColumnDepth(columnDefs), [columnDefs])
  const headerRows = flattenColumns(columnDefs, maxDepth)

  const setRowValuesByIndex = (
    index: number,
    values: GetFieldType<TForm, TName>,
    options?: SetValueConfig
  ) => {
    form.setValue(
      `${String(name)}.${index}` as any,
      values,
      Object.assign(
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true
        },
        options
      )
    )
  }
  const handleAppendRow = () => {
    appendRow(defaultValues)
    ref.current?.scrollTo({
      top: ref.current.scrollHeight,
      behavior: 'smooth'
    })
  }

  return (
    <div
      className="relative w-full h-full overflow-auto"
      ref={ref}
    >
      <table className="w-full table-fixed">
        <thead>
          {headerRows.map((headerRow, rowIndex) => (
            <tr key={rowIndex}>
              {rowIndex === 0 && (
                <EditorHeaderCell
                  rowSpan={headerRows.length}
                  style={{ width: `${indexDigitsCount + 4}ch` }}
                >
                  {}
                </EditorHeaderCell>
              )}
              {headerRow.map((column) => (
                <EditorHeaderCell
                  key={column.key}
                  colSpan={column._colSpan}
                  rowSpan={column._rowSpan}
                >
                  {typeof column.header === 'function' ? (
                    column.header()
                  ) : (
                    <Trans>{column.header}</Trans>
                  )}
                </EditorHeaderCell>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id}>
              <EditorHeaderCell style={{ width: `${indexDigitsCount + 4}ch` }}>
                {rowIndex + 1}
              </EditorHeaderCell>
              {leafColumnDefs.map((column) => {
                return (
                  <Controller
                    key={column.key}
                    control={form.control}
                    name={`${String(name)}.${rowIndex}.${column.key}` as any}
                    render={({ field, fieldState, formState }) => {
                      const rowErrors = formState.errors[
                        `${String(name)}.${rowIndex}` as any
                      ] as FieldErrors<GetFieldType<TForm, TName>>

                      const getRowValues = () => {
                        return form.watch(`${String(name)}.${rowIndex}` as any) as GetFieldType<
                          TForm,
                          TName
                        >
                      }
                      const setRowValues = (
                        values: GetFieldType<TForm, TName>,
                        options?: SetValueConfig
                      ) => {
                        setRowValuesByIndex(rowIndex, values, options)
                      }
                      const setRowFieldValue = (
                        fieldName: keyof GetFieldType<TForm, TName> & string,
                        value: any,
                        options?: SetValueConfig
                      ) => {
                        form.setValue(
                          `${String(name)}.${rowIndex}.${fieldName}` as any,
                          value,
                          Object.assign(
                            {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true
                            },
                            options
                          )
                        )
                      }
                      return (
                        <EditorCell
                          data-rowindex={rowIndex}
                          error={!!fieldState.error}
                          style={{
                            left: column.left ? `${column.left}px` : undefined,
                            right: column.right ? `${column.right}px` : undefined,
                            width: column.size ? `${column.size}px` : undefined
                          }}
                        >
                          {column.render({
                            rowIndex,
                            inputRef: field.ref,
                            form,
                            value: field.value,
                            error: fieldState.error,
                            rowErrors,
                            column,
                            getRowValues,
                            setRowValues,
                            setRowFieldValue,
                            onChange: field.onChange
                          })}
                        </EditorCell>
                      )
                    }}
                  />
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-gray-300 bg-gray-50">
        <button
          onClick={handleAppendRow}
          className="w-full py-3 px-4 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2 border-b border-gray-200"
        >
          <Plus className="w-4 h-4" />
          {t('add')}
        </button>
      </div>
    </div>
  )
}
