import type { EditableTableMethods, VirtualEditableColumnDef } from './interfaces'

import {
  type HTMLAttributes,
  type RefObject,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'

import { type ArrayPath, Controller, type UseFormReturn, useFieldArray } from 'react-hook-form'
import { Trans } from 'react-i18next'
import { FixedSizeList } from 'react-window'

import { AutoSizer } from '@/common/components/auto-sizer'

import { TableCell, TableHead, TableRow } from './components'
import { getLeafColumns, getMaxDepth, handleStickyColumns } from './utils'

interface VirtualEditableTableProps<T extends object, F extends ArrayPath<NoInfer<T>>> {
  methods: RefObject<EditableTableMethods>
  form: UseFormReturn<any>
  name: F
  columnDefs: VirtualEditableColumnDef<T, F>[]
}

export const VirtualEditableTable = <T extends object, F extends ArrayPath<NoInfer<T>>>(
  props: VirtualEditableTableProps<T, F>
) => {
  const { form, name, columnDefs, methods } = props

  const tableRef = useRef<HTMLDivElement>()

  const maxDepth = getMaxDepth(columnDefs)
  const leafColumns = getLeafColumns(columnDefs)

  const gridTemplateColumns = leafColumns
    .map((column) => (column.width ? `${column.width}px` : '1fr'))
    .join(' ')

  const { fields: rows } = useFieldArray({
    control: form.control,
    name
  })

  useImperativeHandle(
    methods,
    () => ({
      scrollToRow: (rowIndex: number) => {
        const rowElement = tableRef.current?.querySelector(`[data-rowindex="${rowIndex}"]`)

        if (rowElement) {
          rowElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          })

          const observer = new IntersectionObserver(([entry], obs) => {
            if (entry.isIntersecting) {
              const inputElement = rowElement.querySelector(
                'input:not(:disabled), textarea:not(:disabled), select:not(:disabled)'
              ) as HTMLInputElement

              setTimeout(() => {
                inputElement?.focus?.({
                  preventScroll: true
                })
              }, 200)

              obs.disconnect()
            }
          })

          observer.observe(rowElement)
        }
      }
    }),
    []
  )

  return (
    <div
      onScroll={(e) => {
        handleStickyColumns(e.currentTarget)
      }}
      ref={(ref) => {
        if (ref) {
          tableRef.current = ref
          handleStickyColumns(ref)
        }
      }}
      className="h-full w-full overflow-x-auto"
    >
      <div className="h-full min-w-min flex flex-col">
        <div className="divide-y w-full min-w-min">
          <div
            className="w-full min-w-min grid divide-x bg-white"
            style={{
              gridTemplateColumns,
              gridAutoRows: '40px'
            }}
          >
            {columnDefs.map((column, index) => (
              <HeaderCell
                key={index}
                columnDef={column}
                depth={1}
                maxDepth={maxDepth}
                startCol={leafColumns
                  .slice(0, index)
                  .reduce((acc, c) => acc + getLeafColumns([c]).length, 1)}
              />
            ))}
          </div>
        </div>

        <AutoSizer>
          {({ ref, height, width }) => {
            return (
              <div
                ref={ref}
                className="flex-1 overflow-hidden"
              >
                <FixedSizeList
                  itemCount={rows.length}
                  itemSize={40}
                  overscanCount={10}
                  width={width ?? 0}
                  height={height}
                  style={{ overflowX: 'hidden', overflowY: 'auto' }}
                  onScroll={() => {
                    if (tableRef.current) {
                      handleStickyColumns(tableRef.current)
                    }
                  }}
                >
                  {({ index, style }) => {
                    return (
                      <TableRow
                        key={index}
                        style={{
                          ...style,
                          gridTemplateColumns,
                          gridAutoRows: '40px'
                        }}
                      >
                        <Cell
                          columnDefs={columnDefs}
                          index={index}
                          name={name}
                          row={rows[index]}
                          rows={rows}
                          form={form}
                          tabIndex={1}
                        />
                      </TableRow>
                    )
                  }}
                </FixedSizeList>
              </div>
            )
          }}
        </AutoSizer>
      </div>
    </div>
  )
}

interface HeaderCellProps<T extends object, F extends ArrayPath<NoInfer<T>>> {
  columnDef: VirtualEditableColumnDef<T, F>
  depth: number
  minSize?: number
  maxDepth: number
  startCol: number
}
const HeaderCell = <T extends object, F extends ArrayPath<NoInfer<T>>>({
  columnDef,
  depth,
  maxDepth,
  startCol
}: HeaderCellProps<T, F>) => {
  const leafCount = columnDef.columns ? getLeafColumns(columnDef.columns).length : 1
  const colSpan = leafCount
  const rowSpan = columnDef.columns ? 1 : maxDepth - depth + 1

  const { header, key, headerClassName } = columnDef

  return (
    <>
      <TableHead
        style={{
          gridColumn: `${startCol} / span ${colSpan}`,
          gridRow: `${depth} / span ${rowSpan}`,
          minWidth: columnDef.minWidth
        }}
        data-sticky={columnDef.sticky ? true : undefined}
        data-left={columnDef.left !== undefined ? columnDef.left : undefined}
        data-right={columnDef.right !== undefined ? columnDef.right : undefined}
        className={headerClassName}
      >
        {!header ? (
          <Trans>{String(key)}</Trans>
        ) : typeof header === 'string' ? (
          <Trans>{header}</Trans>
        ) : null}
      </TableHead>
      {
        columnDef.columns?.reduce(
          (acc, child) => {
            const childStart = startCol + acc.totalLeafCount
            const childResult = (
              <HeaderCell
                key={`${child.header}-${childStart}`}
                columnDef={child}
                depth={depth + 1}
                maxDepth={maxDepth}
                startCol={childStart}
              />
            )
            return {
              totalLeafCount: acc.totalLeafCount + getLeafColumns([child]).length,
              elements: [...acc.elements, childResult]
            }
          },
          { totalLeafCount: 0, elements: [] as React.ReactNode[] }
        ).elements
      }
    </>
  )
}

interface CellProps<T extends object, F extends ArrayPath<NoInfer<T>>>
  extends Pick<VirtualEditableTableProps<T, F>, 'name' | 'form' | 'columnDefs'>,
    HTMLAttributes<HTMLTableRowElement> {
  tabIndex?: number
  index: number
  row: any
  rows: any
}
const Cell = <T extends object, R extends T[ArrayPath<NoInfer<T>>]>({
  tabIndex,
  index,
  columnDefs,
  row,
  rows,
  form
}: CellProps<T, R>) => {
  const [state, setState] = useState<Record<string, unknown>>({})

  const leafColumns = useMemo(() => getLeafColumns(columnDefs), [columnDefs])

  return leafColumns.map((column) => {
    const { key, Editor, minWidth, sticky, left, right } = column

    return (
      <TableCell
        key={String(key)}
        className="bg-inherit"
        style={{ minWidth }}
        data-sticky={sticky ? true : undefined}
        data-left={left !== undefined ? left : undefined}
        data-right={right !== undefined ? right : undefined}
      >
        <Controller
          control={form.control}
          name={`users.${index}.${String(key)}`}
          render={({ field }) => (
            <Editor
              tabIndex={tabIndex}
              inputRef={field.ref}
              index={index}
              row={row}
              column={column}
              rows={rows}
              form={form}
              value={field.value}
              onChange={field.onChange}
              errors={{}}
              params={{}}
              state={state}
              setState={setState}
              data-editorId={`${index}-${String(key)}`}
            />
          )}
        />
      </TableCell>
    )
  })
}
