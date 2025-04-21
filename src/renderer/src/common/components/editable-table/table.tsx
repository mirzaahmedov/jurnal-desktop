import type { EditableTableProps } from './interface'
import type { ArrayPath, FieldArrayWithId, Path } from 'react-hook-form'

import { type HTMLAttributes, useImperativeHandle, useMemo, useRef, useState } from 'react'

import { CircleMinus, CirclePlus } from 'lucide-react'
import { Controller, type FieldErrors, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/common/components/ui/button'
import { Table, TableBody, TableFooter, TableHeader } from '@/common/components/ui/table'
import { cn } from '@/common/lib/utils'

import { EmptyList } from '../empty-states'
import { getHeaderGroups } from '../generic-table/utils'
import { EditableTableCell, EditableTableHead, EditableTableRow } from './components'
import { getAccessorColumns } from './utils'

export const EditableTable = <T extends object, F extends ArrayPath<NoInfer<T>>>(
  props: EditableTableProps<T, F>
) => {
  const {
    tableRef,
    tabIndex,
    name,
    form,
    columnDefs,
    className,
    divProps,
    errors,
    placeholder,
    onCreate,
    onDelete,
    onCellDoubleClick,
    params = {},
    validate,
    getEditorProps,
    getRowClassName,
    methods
  } = props

  const innerRef = useRef<HTMLTableElement>(null)
  const ref = tableRef || innerRef

  const { t } = useTranslation()

  const { fields: rows } = useFieldArray({
    control: form.control,
    name
  })

  useImperativeHandle(
    methods,
    () => ({
      scrollToRow: (rowIndex: number) => {
        const rowElement = ref.current?.querySelector(`[data-rowId="${rowIndex}"]`)

        if (rowElement) {
          rowElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          })
          const inputElement = rowElement.querySelector(
            'input:not(:disabled), textarea:not(:disabled), select:not(:disabled)'
          ) as HTMLInputElement
          inputElement?.focus?.({
            preventScroll: true
          })
        }
      }
    }),
    []
  )

  const headerGroups = useMemo(() => {
    return getHeaderGroups(columnDefs)
  }, [columnDefs])

  return (
    <div
      {...divProps}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      onFocus={(e) => {
        e.target.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }}
      className={cn('relative', divProps?.className)}
    >
      <Table
        ref={ref}
        className={cn('border border-slate-200', className)}
      >
        <TableHeader className="sticky top-0 z-50 shadow-sm">
          {Array.isArray(columnDefs)
            ? headerGroups.map((headerGroup, index) => (
                <EditableTableRow key={index}>
                  {index === 0 ? (
                    <EditableTableHead
                      key="line_number"
                      className="px-3 whitespace-nowrap w-0 min-w-11"
                      rowSpan={headerGroups.length}
                    ></EditableTableHead>
                  ) : null}
                  {Array.isArray(headerGroup)
                    ? headerGroup.map((column) => {
                        const {
                          _colSpan,
                          _rowSpan,
                          key,
                          header,
                          width,
                          minWidth,
                          maxWidth,
                          headerClassName
                        } = column
                        return (
                          <EditableTableHead
                            key={String(key)}
                            style={{
                              width,
                              minWidth,
                              maxWidth
                            }}
                            colSpan={_colSpan}
                            rowSpan={_rowSpan}
                            className={headerClassName}
                          >
                            {!header
                              ? t(key.toString())
                              : typeof header === 'string'
                                ? t(header)
                                : null}
                          </EditableTableHead>
                        )
                      })
                    : null}
                  {typeof onDelete === 'function' && index === 0 ? (
                    <EditableTableHead key="delete"></EditableTableHead>
                  ) : null}
                </EditableTableRow>
              ))
            : null}
        </TableHeader>
        <TableBody>
          {Array.isArray(rows) && rows.length ? (
            rows.map((row, index) => (
              <EditableTableRowRenderer
                key={index}
                index={index}
                tabIndex={tabIndex}
                row={row as any}
                rows={rows as any}
                name={name}
                form={form}
                columnDefs={columnDefs}
                errors={errors}
                onDelete={onDelete}
                onCellDoubleClick={onCellDoubleClick}
                params={params}
                validate={validate}
                getEditorProps={getEditorProps}
                getRowClassName={getRowClassName}
              />
            ))
          ) : (
            <EditableTableRow>
              <EditableTableCell
                colSpan={100}
                className="text-center py-5"
              >
                <EmptyList
                  iconProps={{
                    className: 'w-40'
                  }}
                >
                  {placeholder}
                </EmptyList>
              </EditableTableCell>
            </EditableTableRow>
          )}
        </TableBody>
        {typeof onCreate === 'function' && (
          <TableFooter>
            {props.footerRows}
            <EditableTableRow focusable={false}>
              <EditableTableCell colSpan={100}>
                <Button
                  tabIndex={tabIndex}
                  type="button"
                  variant="ghost"
                  className="w-full hover:bg-slate-50 text-brand hover:text-brand"
                  onClick={onCreate}
                >
                  <CirclePlus className="btn-icon icon-start" /> {t('add')}
                </Button>
              </EditableTableCell>
            </EditableTableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  )
}

interface EditableTableRowRendererProps<T extends object, F extends ArrayPath<NoInfer<T>>>
  extends Pick<
      EditableTableProps<T, F>,
      | 'validate'
      | 'name'
      | 'form'
      | 'params'
      | 'onDelete'
      | 'onCellDoubleClick'
      | 'errors'
      | 'columnDefs'
      | 'getEditorProps'
      | 'getRowClassName'
    >,
    HTMLAttributes<HTMLTableRowElement> {
  tabIndex?: number
  index: number
  row: FieldArrayWithId<T, F, 'id'>
  rows: FieldArrayWithId<T, F, 'id'>[]
}
const EditableTableRowRenderer = <T extends object, R extends T[ArrayPath<NoInfer<T>>]>({
  tabIndex,
  index,
  columnDefs,
  row,
  rows,
  name,
  form,
  errors,
  onDelete,
  onCellDoubleClick,
  params,
  validate,
  getEditorProps,
  getRowClassName,
  ...props
}: EditableTableRowRendererProps<T, R>) => {
  const [state, setState] = useState<Record<string, unknown>>({})

  const accessorColumns = useMemo(() => getAccessorColumns(columnDefs), [columnDefs])

  return (
    <EditableTableRow
      data-rowId={index}
      className={getRowClassName?.({ index, row, rows })}
      focusable={rows.length > 1}
      {...props}
    >
      <EditableTableCell
        key="line_number"
        className="px-3 font-medium"
      >
        {index + 1}
      </EditableTableCell>
      {Array.isArray(columnDefs)
        ? accessorColumns.map((column) => {
            const { key, Editor, width, minWidth, maxWidth, className } = column
            return (
              <Controller
                key={String(key)}
                control={form.control}
                name={`${name}.${index}.${String(key)}` as Path<T>}
                render={({ field }) => {
                  return (
                    <EditableTableCell
                      style={{ width, minWidth, maxWidth }}
                      className={className}
                      onDoubleClick={(event) => {
                        onCellDoubleClick?.({
                          column,
                          row,
                          rows,
                          value: field.value,
                          onChange: field.onChange,
                          event,
                          index
                        })
                      }}
                    >
                      <Editor
                        tabIndex={tabIndex}
                        inputRef={field.ref}
                        id={index}
                        row={row}
                        rows={rows}
                        col={column}
                        form={form}
                        value={field.value}
                        onChange={field.onChange}
                        errors={errors?.[index] as FieldErrors<R>}
                        state={state}
                        setState={setState}
                        params={params!}
                        validate={validate}
                        data-editorId={`${index}-${String(key)}`}
                        {...getEditorProps?.({
                          index,
                          row,
                          rows,
                          value: field.value,
                          onChange: field.onChange,
                          col: column,
                          errors: errors?.[index] as FieldErrors<R>
                        })}
                      />
                    </EditableTableCell>
                  )
                }}
              />
            )
          })
        : null}
      {typeof onDelete === 'function' && (
        <EditableTableCell className="whitespace-nowrap w-0">
          <Button
            tabIndex={tabIndex}
            type="button"
            variant="ghost"
            className="hover:bg-slate-50 hover:text-red-500 text-red-400"
            onClick={() => onDelete?.({ id: index })}
          >
            <CircleMinus className="btn-icon !mx-0" />
          </Button>
        </EditableTableCell>
      )}
    </EditableTableRow>
  )
}
