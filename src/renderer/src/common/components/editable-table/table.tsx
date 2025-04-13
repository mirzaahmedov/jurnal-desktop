import type { EditableTableProps, InferRow, TableRowField } from './interface'
import type { ArrayPath, Path } from 'react-hook-form'

import { useImperativeHandle, useMemo, useRef, useState } from 'react'

import { CircleMinus, CirclePlus, SquareMinus } from 'lucide-react'
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
  const headerGroups = useMemo(() => getHeaderGroups(columnDefs), [columnDefs])
  const ref = tableRef || innerRef

  const [highlightedRows, setHighlightedRows] = useState<number[]>([])

  const { t } = useTranslation()

  const { fields: rows } = useFieldArray({
    control: form.control,
    name
  })

  useImperativeHandle(
    methods,
    () => ({
      highlightRow: (rowIndex) => {
        setHighlightedRows((prev) => {
          if (prev.includes(rowIndex)) {
            return prev.filter((i) => i !== rowIndex)
          } else {
            return [...prev, rowIndex]
          }
        })
      },
      setHighlightedRows: setHighlightedRows,
      scrollToRow: (rowIndex: number) => {
        ref.current?.querySelector(`[data-rowId="${rowIndex}"]`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }
    }),
    []
  )

  return (
    <div
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
                      className={cn(
                        'px-3 whitespace-nowrap w-0 min-w-11',
                        highlightedRows.length && 'cursor-pointer'
                      )}
                      rowSpan={headerGroups.length}
                      onClick={
                        highlightedRows
                          ? () => {
                              setHighlightedRows([])
                            }
                          : undefined
                      }
                    >
                      {highlightedRows.length ? (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-full"
                        >
                          <SquareMinus className="btn-icon" />
                        </Button>
                      ) : null}
                    </EditableTableHead>
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
            rows.map((row, index) => {
              return (
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
                  highlightedRows={highlightedRows}
                  onHighlight={(index) => {
                    setHighlightedRows((prev) => {
                      if (prev.includes(index)) {
                        return prev.filter((i) => i !== index)
                      } else {
                        return [...prev, index]
                      }
                    })
                  }}
                />
              )
            })
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
            <EditableTableRow>
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
  > {
  tabIndex?: number
  index: number
  row: TableRowField<InferRow<T, F>>
  rows: TableRowField<InferRow<T, F>>[]
  highlightedRows: number[]
  onHighlight?(index: number): void
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
  highlightedRows,
  onHighlight
}: EditableTableRowRendererProps<T, R>) => {
  const [state, setState] = useState<Record<string, unknown>>({})

  const accessorColumns = useMemo(() => getAccessorColumns(columnDefs), [columnDefs])

  return (
    <EditableTableRow
      data-rowId={index}
      data-highlighted={highlightedRows.includes(index)}
      className={getRowClassName?.({ index, row, rows })}
    >
      <EditableTableCell
        key="line_number"
        className="px-3 font-medium cursor-pointer hover:bg-slate-50 group-data-[highlighted=true]/row:bg-brand/10 group-data-[highlighted=true]/row:border-brand/20"
        onClick={() => {
          onHighlight?.(index)
        }}
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
                      className={cn(
                        'group-data-[highlighted=true]/row:bg-brand/10 group-data-[highlighted=true]/row:border-brand/20',
                        className
                      )}
                      onDoubleClick={() => {
                        onCellDoubleClick?.({
                          col: column,
                          row,
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
