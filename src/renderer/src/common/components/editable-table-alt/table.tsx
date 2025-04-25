import type { EditableColumnDef, EditableTableProps } from './interface'
import type { ArrayPath, FieldArrayWithId, Path } from 'react-hook-form'

import {
  type HTMLAttributes,
  type MutableRefObject,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'

import { useVirtualizer } from '@tanstack/react-virtual'
import { CircleMinus, CirclePlus } from 'lucide-react'
import { Controller, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/common/components/ui/button'
import { Table, TableBody, TableFooter, TableHeader } from '@/common/components/ui/table'
import { cn } from '@/common/lib/utils'

import { EmptyList } from '../empty-states'
import { getHeaderGroups } from '../generic-table/utils'
import { EditableTableCell, EditableTableHead, EditableTableRow } from './components'
import { getDataColumns } from './utils'

export const EditableTableAlt = <T extends object, F extends ArrayPath<NoInfer<T>>>(
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

  const highlightedRow = useRef<number | null>(null)
  const innerRef = useRef<HTMLTableElement>(null)
  const ref = tableRef || innerRef

  const { t } = useTranslation()

  const { fields: rows } = useFieldArray({
    control: form.control,
    name
  })

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => ref.current,
    estimateSize: () => 44,
    overscan: 5
  })

  useImperativeHandle(
    methods,
    () => ({
      scrollToRow: (rowIndex: number) => {
        rowVirtualizer.scrollToIndex(rowIndex, {
          align: 'center',
          behavior: 'smooth'
        })
        highlightedRow.current = rowIndex
      }
    }),
    [rowVirtualizer]
  )

  const headerGroups = useMemo(() => {
    return getHeaderGroups(columnDefs)
  }, [columnDefs])
  const dataColumns = useMemo(() => {
    return getDataColumns(columnDefs)
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
      className={cn('relative h-full flex flex-col overflow-hidden', divProps?.className)}
    >
      <Table className={cn('border border-slate-200 table-fixed', className)}>
        <TableHeader className="shadow-sm">
          {Array.isArray(columnDefs)
            ? headerGroups.map((headerGroup, index) => (
                <EditableTableRow key={index}>
                  {index === 0 ? (
                    <EditableTableHead
                      key="line_number"
                      className="px-3 whitespace-nowrap text-sm font-medium"
                      style={{
                        width: `${String(rows.length).length + 3}ch`
                      }}
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
      </Table>
      <div
        className="overflow-auto flex-1 scrollbar"
        ref={ref}
      >
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
          <Table className={cn('border border-slate-200 table-fixed', className)}>
            <TableBody className="overflow-auto">
              {Array.isArray(rows) && rows.length ? (
                rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
                  const row = rows[virtualRow.index]
                  return (
                    <EditableTableRowRenderer
                      key={virtualRow.index}
                      index={virtualRow.index}
                      highlightedRow={highlightedRow}
                      tabIndex={tabIndex}
                      row={row as any}
                      rows={rows as any}
                      name={name}
                      form={form}
                      columnDefs={columnDefs}
                      dataColumns={dataColumns}
                      onDelete={onDelete}
                      onCellDoubleClick={onCellDoubleClick}
                      params={params}
                      validate={validate}
                      getEditorProps={getEditorProps}
                      getRowClassName={getRowClassName}
                      style={{
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`
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
          </Table>
        </div>
      </div>

      <Table className={cn('border border-slate-200 table-fixed', className)}>
        {onCreate || props.footer ? (
          <TableFooter>
            {props.footer?.({
              ...props,
              dataColumns
            })}
            {onCreate ? (
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
            ) : null}
          </TableFooter>
        ) : null}
      </Table>
    </div>
  )
}

export interface EditableRowProps<T extends object, F extends ArrayPath<NoInfer<T>>>
  extends Pick<
      EditableTableProps<T, F>,
      | 'validate'
      | 'name'
      | 'form'
      | 'params'
      | 'onDelete'
      | 'onCellDoubleClick'
      | 'columnDefs'
      | 'getEditorProps'
      | 'getRowClassName'
    >,
    HTMLAttributes<HTMLTableRowElement> {
  type?: 'footer'
  dataColumns: EditableColumnDef<T, F>[]
  tabIndex?: number
  index: number
  highlightedRow: MutableRefObject<number | null>
  row: FieldArrayWithId<T, F, 'id'>
  rows: FieldArrayWithId<T, F, 'id'>[]
}
export const EditableTableRowRenderer = <T extends object, F extends ArrayPath<NoInfer<T>>>({
  tabIndex,
  type,
  index,
  highlightedRow,
  columnDefs,
  dataColumns,
  row,
  rows,
  name,
  form,
  onDelete,
  onCellDoubleClick,
  params,
  validate,
  getEditorProps,
  getRowClassName,
  ...props
}: EditableRowProps<T, F>) => {
  const [state, setState] = useState<Record<string, unknown>>({})

  return (
    <EditableTableRow
      rowRef={(element) => {
        if (index === highlightedRow?.current) {
          highlightedRow.current = null
          const input = element?.querySelector(
            `[data-rowindex="${index}"] input`
          ) as HTMLInputElement
          input?.focus()
        }
      }}
      data-rowindex={index}
      className={getRowClassName?.({ index, row, rows })}
      focusable={rows.length > 1}
      {...props}
    >
      <EditableTableCell
        key="line_number"
        className="px-3 font-medium"
        style={{
          width: `${String(rows.length).length + 3}ch`
        }}
      >
        {index + 1}
      </EditableTableCell>
      {Array.isArray(columnDefs)
        ? dataColumns.map((column) => {
            const { key, Editor, width, minWidth, maxWidth, className } = column
            return type === 'footer' ? (
              <EditableTableCell
                style={{ width, minWidth, maxWidth }}
                className={className}
                onDoubleClick={(event) => {
                  onCellDoubleClick?.({
                    column,
                    row,
                    rows,
                    value: row[key as any],
                    onChange: undefined,
                    event,
                    index
                  })
                }}
              >
                <Editor
                  tabIndex={tabIndex}
                  inputRef={null as any}
                  index={index}
                  row={row}
                  rows={rows}
                  column={column}
                  form={form}
                  value={row[key as any]}
                  onChange={undefined}
                  error={undefined}
                  state={state}
                  setState={setState}
                  params={params!}
                  validate={validate}
                  data-editorId={`${index}-${String(key)}`}
                  {...getEditorProps?.({
                    index,
                    row,
                    rows,
                    value: row[key as any],
                    onChange: undefined,
                    column
                  })}
                />
              </EditableTableCell>
            ) : (
              <Controller
                key={String(key)}
                control={form.control}
                name={`${name}.${index}.${String(key)}` as Path<T>}
                render={({ field, fieldState }) => {
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
                        index={index}
                        row={row}
                        rows={rows}
                        column={column}
                        form={form}
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error}
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
                          column
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
