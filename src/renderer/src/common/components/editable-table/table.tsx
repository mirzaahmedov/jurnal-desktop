import type { ChangeContext, DeleteContext } from './editors/types'
import type { EditableColumnDef } from './interface'
import type { FieldErrors } from 'react-hook-form'

import { type ReactNode, type RefObject, useMemo, useState } from 'react'

import { Button } from '@renderer/common/components/ui/button'
import { Table, TableBody, TableFooter, TableHeader } from '@renderer/common/components/ui/table'
import { cn } from '@renderer/common/lib/utils'
import { CircleMinus, CirclePlus, SquareMinus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { EmptyList } from '../empty-states'
import { getHeaderGroups } from '../generic-table/utils'
import { EditableTableCell, EditableTableHead, EditableTableRow } from './components'
import { getAccessorColumns } from './utils'

export interface EditableTableProps<T extends object> {
  tableRef?: RefObject<HTMLTableElement>
  tabIndex?: number
  data: T[]
  columnDefs: EditableColumnDef<T>[]
  className?: string
  errors?: FieldErrors<{ example: T[] }>['example']
  getRowClassName?: (args: { index: number; row: T; data: T[] }) => string
  placeholder?: string
  onDelete?(ctx: DeleteContext): void
  onChange?(ctx: ChangeContext<T>): void
  onCreate?(): void
  params?: Record<string, unknown>
  footerRows?: ReactNode
  validate?(ctx: ChangeContext<T>): boolean
}
export const EditableTable = <T extends object>(props: EditableTableProps<T>) => {
  const {
    tableRef,
    tabIndex,
    data,
    columnDefs,
    className,
    errors,
    placeholder,
    onCreate,
    onDelete,
    onChange,
    params = {},
    validate,
    getRowClassName
  } = props

  const [highlightedRows, setHighlightedRows] = useState<number[]>([])

  const { t } = useTranslation()

  const headerGroups = useMemo(() => getHeaderGroups(columnDefs), [columnDefs])

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
        ref={tableRef}
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
                    ? headerGroup.map((col) => {
                        const {
                          _colSpan,
                          _rowSpan,
                          key,
                          header,
                          width,
                          minWidth,
                          maxWidth,
                          headerClassName
                        } = col
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
          {Array.isArray(data) && data.length ? (
            data.map((row, index) => {
              return (
                <EditableTableRowRenderer
                  key={index}
                  index={index}
                  tabIndex={tabIndex}
                  row={row}
                  data={data}
                  columnDefs={columnDefs}
                  errors={errors}
                  onChange={onChange}
                  onDelete={onDelete}
                  params={params}
                  validate={validate}
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

interface EditableTableRowRendererProps<T extends object>
  extends Pick<
    EditableTableProps<T>,
    | 'getRowClassName'
    | 'validate'
    | 'params'
    | 'onDelete'
    | 'onChange'
    | 'errors'
    | 'data'
    | 'columnDefs'
  > {
  tabIndex?: number
  index: number
  row: T
  highlightedRows: number[]
  onHighlight?(index: number): void
}
const EditableTableRowRenderer = <T extends object>({
  tabIndex,
  index,
  columnDefs,
  row,
  data,
  errors,
  onDelete,
  onChange,
  params,
  validate,
  getRowClassName,
  highlightedRows,
  onHighlight
}: EditableTableRowRendererProps<T>) => {
  const [state, setState] = useState<Record<string, unknown>>({})

  const accessorColumns = useMemo(() => getAccessorColumns(columnDefs), [columnDefs])

  return (
    <EditableTableRow
      data-highlighted={highlightedRows.includes(index)}
      className={getRowClassName?.({ index, row, data })}
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
        ? accessorColumns.map((col) => {
            const { key, Editor, width, minWidth, maxWidth, className } = col
            return (
              <EditableTableCell
                key={String(key)}
                style={{ width, minWidth, maxWidth }}
                className={cn(
                  'group-data-[highlighted=true]/row:bg-brand/10 group-data-[highlighted=true]/row:border-brand/20',
                  className
                )}
              >
                <Editor
                  tabIndex={tabIndex}
                  id={index}
                  row={row}
                  data={data}
                  col={col}
                  onChange={onChange}
                  errors={errors?.[index] as FieldErrors<T>}
                  state={state}
                  setState={setState}
                  params={params!}
                  validate={validate}
                  data-editorId={`${index}-${String(key)}`}
                />
              </EditableTableCell>
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
