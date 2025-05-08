import type { VirtualEditableRowProps } from './interface'
import type { VirtualEditableTableProps } from './interface'
import type { ArrayPath, Path } from 'react-hook-form'

import { useImperativeHandle, useMemo, useRef, useState } from 'react'

import { useVirtualizer } from '@tanstack/react-virtual'
import { CircleMinus, CirclePlus } from 'lucide-react'
import { Controller, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/common/components/ui/button'
import { Table, TableBody, TableFooter, TableHeader } from '@/common/components/ui/table'
import { cn } from '@/common/lib/utils'

import { EmptyList } from '../empty-states'
import { getHeaderGroups } from '../generic-table/utils'
import { inputVariants } from '../ui/input'
import { TableCell, TableHead, TableRow } from './components'
import { getLeafColumns } from './utils'

const handleStickyColumns = (container?: HTMLDivElement) => {
  if (!container) return

  const stickyCells = container.querySelectorAll('[data-sticky]') as NodeListOf<HTMLElement>
  stickyCells.forEach((cell) => {
    const left = !isNaN(Number(cell.dataset.left)) ? Number(cell.dataset.left) : undefined
    const right = cell.dataset.right ? Number(cell.dataset.right) : null
    const containerRect = container.getBoundingClientRect()
    const cellRect = cell.getBoundingClientRect()

    if (cellRect.width > containerRect.width) {
      cell.style.transform = `translateX(0px)`
      cell.style.zIndex = '0'
      cell.style.borderLeftWidth = '0px'
      return
    }

    if (left !== undefined) {
      const deltaX = cellRect.left - containerRect.left - left
      const translateX =
        parseFloat(cell.style.transform.match(/translateX\(([^)]+)\)/)?.[1] ?? '0') || 0
      const originalLeft = cellRect.left - translateX

      if (originalLeft >= containerRect.left + left) {
        cell.style.transform = `translateX(0px)`
        cell.classList.remove('sticky-cell')
      } else if (deltaX < 0) {
        cell.style.transform = `translateX(${Math.abs(deltaX) + translateX}px)`
        cell.classList.add('sticky-cell')
      } else if (deltaX > 0) {
        cell.style.transform = `translateX(${translateX - Math.abs(deltaX)}px)`
        cell.classList.add('sticky-cell')
      }
    }

    if (right !== null) {
      const deltaX = cellRect.right - (containerRect.right - right)
      const translateX =
        parseFloat(cell.style.transform.match(/translateX\(([^)]+)\)/)?.[1] ?? '0') || 0
      const originalRight = cellRect.right - translateX

      if (originalRight <= containerRect.right - right) {
        cell.style.transform = `translateX(0px)`
        cell.classList.remove('sticky-cell')
        cell.style.borderLeftWidth = '0px'
      } else if (deltaX > 0) {
        cell.style.transform = `translateX(${translateX - Math.abs(deltaX)}px)`
        cell.classList.add('sticky-cell')
        cell.style.borderLeftWidth = '1px'
      } else if (deltaX < 0) {
        cell.style.transform = `translateX(${Math.abs(deltaX) + translateX}px)`
        cell.classList.add('sticky-cell')
        cell.style.borderLeftWidth = '1px'
      }
    }
  })
}

const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const container = e.currentTarget
  handleStickyColumns(container)
}

export const VirtualEditableTable = <T extends object, F extends ArrayPath<NoInfer<T>>>(
  props: VirtualEditableTableProps<T, F>
) => {
  const {
    readOnly,
    disableHeader = false,
    tableRef,
    tabIndex,
    name,
    form,
    columnDefs,
    className,
    divProps,
    placeholder,
    onRowCreate,
    onDelete,
    onCellDoubleClick,
    params = {},
    validate,
    getEditorProps,
    getRowClassName,
    getFooterRows,
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
    overscan: 10
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

  const footerRows = getFooterRows?.(props)
  const headerRows = useMemo(() => {
    return getHeaderGroups(columnDefs)
  }, [columnDefs])
  const leafColumns = useMemo(() => {
    return getLeafColumns(columnDefs)
  }, [columnDefs])

  const gridTemplateColumns = leafColumns.map((column) => `${column.width ?? '1fr'}`).join(' ')

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
      ref={(ref) => handleStickyColumns(ref ?? undefined)}
      onScroll={handleScroll}
      className={cn('relative h-full flex flex-col overflow-x-auto scrollbar', divProps?.className)}
    >
      {!disableHeader ? (
        <Table className={cn('border border-slate-200 table-fixed', className)}>
          <TableHeader className="shadow-sm">
            {Array.isArray(columnDefs)
              ? headerRows.map((row, index) => (
                  <TableRow key={index}>
                    {index === 0 ? (
                      <TableHead
                        key="line_number"
                        className="px-3 whitespace-nowrap text-sm font-medium"
                        style={{
                          width: `${String(rows.length + 1).length + 3}ch`
                        }}
                        rowSpan={headerRows.length}
                      ></TableHead>
                    ) : null}
                    {Array.isArray(row)
                      ? row.map((column) => {
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
                            <TableHead
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
                            </TableHead>
                          )
                        })
                      : null}
                    {typeof onDelete === 'function' && index === 0 ? (
                      <TableHead key="delete"></TableHead>
                    ) : null}
                  </TableRow>
                ))
              : null}
          </TableHeader>
        </Table>
      ) : null}

      <div
        className="w-min min-w-full overflow-y-auto overflow-x-hidden flex-1 scrollbar"
        ref={ref}
      >
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
          <div
            className="grid"
            style={{ gridTemplateColumns }}
          >
            {Array.isArray(rows) && rows.length ? (
              rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
                const row = rows[virtualRow.index]
                return (
                  <TableRow
                    key={virtualRow.index}
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
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`
                    }}
                  >
                    <RowColumns
                      index={virtualRow.index}
                      readOnly={readOnly}
                      startRowNumber={1}
                      tabIndex={tabIndex}
                      row={row as any}
                      rows={rows as any}
                      name={name}
                      form={form}
                      columnDefs={columnDefs}
                      leafColumns={leafColumns}
                      onDelete={onDelete}
                      onCellDoubleClick={onCellDoubleClick}
                      params={params}
                      validate={validate}
                      getEditorProps={getEditorProps}
                    />
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
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
                </TableCell>
              </TableRow>
            )}
          </div>
        </div>
      </div>

      {footerRows ? (
        <Table className={cn('border border-slate-200 table-fixed', className)}>
          <TableFooter className="shadow-sm">
            {Array.isArray(footerRows)
              ? footerRows.map((row, index) => (
                  <TableRow key={index}>
                    <FooterRowColumns
                      index={index}
                      readOnly={readOnly}
                      startRowNumber={rows.length}
                      tabIndex={tabIndex}
                      row={row as any}
                      rows={rows as any}
                      name={name}
                      form={form}
                      columnDefs={columnDefs}
                      leafColumns={leafColumns}
                      onDelete={onDelete}
                      onCellDoubleClick={onCellDoubleClick}
                      params={params}
                      validate={validate}
                      getEditorProps={getEditorProps}
                    />
                  </TableRow>
                ))
              : null}
          </TableFooter>
        </Table>
      ) : null}
      {onRowCreate ? (
        <Button
          tabIndex={tabIndex}
          type="button"
          variant="ghost"
          className="w-full sticky left-0 right-0 hover:bg-slate-50 text-brand hover:text-brand"
          onClick={onRowCreate}
        >
          <CirclePlus className="btn-icon icon-start" /> {t('add')}
        </Button>
      ) : null}
    </div>
  )
}

const RowColumns = <T extends object, F extends ArrayPath<NoInfer<T>>>({
  readOnly,
  startRowNumber = 1,
  tabIndex,
  index,
  columnDefs,
  leafColumns,
  row,
  rows,
  name,
  form,
  onDelete,
  onCellDoubleClick,
  params,
  validate,
  getEditorProps
}: VirtualEditableRowProps<T, F>) => {
  const [state, setState] = useState<Record<string, unknown>>({})

  return (
    <>
      <TableCell
        key="line_number"
        className="px-3 font-medium"
        style={{
          width: `${String(rows.length + startRowNumber).length + 3}ch`
        }}
      >
        {index + startRowNumber}
      </TableCell>
      {Array.isArray(columnDefs)
        ? leafColumns.map((column) => {
            const { key, Editor, width, minWidth, maxWidth, className, sticky, left, right } =
              column
            return (
              <Controller
                key={String(key)}
                control={form.control}
                name={`${name}.${index}.${String(key)}` as Path<T>}
                render={({ field, fieldState }) => {
                  return (
                    <TableCell
                      style={{ width, minWidth, maxWidth }}
                      className={className}
                      data-sticky={sticky ? true : undefined}
                      data-left={left !== undefined ? left : undefined}
                      data-right={right !== undefined ? right : undefined}
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
                        readOnly={readOnly}
                        {...getEditorProps?.({
                          index,
                          row,
                          rows,
                          value: field.value,
                          onChange: field.onChange,
                          column
                        })}
                      />
                    </TableCell>
                  )
                }}
              />
            )
          })
        : null}
      {onDelete ? (
        <TableCell
          className="whitespace-nowrap w-0"
          data-sticky="true"
          data-right="0"
        >
          <Button
            tabIndex={tabIndex}
            type="button"
            variant="ghost"
            className="hover:bg-slate-50 hover:text-red-500 text-red-400"
            onClick={() => onDelete?.({ id: index })}
          >
            <CircleMinus className="btn-icon !mx-0" />
          </Button>
        </TableCell>
      ) : null}
    </>
  )
}

const FooterRowColumns = <T extends object, F extends ArrayPath<NoInfer<T>>>({
  startRowNumber = 1,
  tabIndex,
  index,
  columnDefs,
  leafColumns,
  row,
  rows,
  onDelete
}: VirtualEditableRowProps<T, F>) => {
  return (
    <>
      <TableCell
        key="line_number"
        className="px-3 font-medium"
        style={{
          width: `${String(rows.length + startRowNumber).length + 3}ch`
        }}
      >
        {index + startRowNumber}
      </TableCell>
      {Array.isArray(columnDefs)
        ? leafColumns.map((column) => {
            const { key, width, minWidth, maxWidth, className, sticky, left, right } = column
            return (
              <TableCell
                key={String(key)}
                style={{ width, minWidth, maxWidth }}
                className={className}
                data-sticky={sticky ? true : undefined}
                data-left={left !== undefined ? left : undefined}
                data-right={right !== undefined ? right : undefined}
              >
                <input
                  readOnly
                  tabIndex={-1}
                  value={row[String(key)]}
                  className={inputVariants({
                    editor: true
                  })}
                />
              </TableCell>
            )
          })
        : null}
      {onDelete ? (
        <TableCell
          className="whitespace-nowrap w-0"
          data-sticky="true"
          data-right="0"
        >
          <Button
            tabIndex={tabIndex}
            type="button"
            variant="ghost"
            className="hover:bg-slate-50 hover:text-red-500 text-red-400"
            onClick={() => onDelete?.({ id: index })}
          >
            <CircleMinus className="btn-icon !mx-0" />
          </Button>
        </TableCell>
      ) : null}
    </>
  )
}
