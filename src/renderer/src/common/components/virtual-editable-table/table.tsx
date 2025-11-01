import type { ArrayPath } from 'react-hook-form'

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'

import {
  type ColumnDef,
  type Row,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { CircleMinus, CirclePlus, CopyPlus } from 'lucide-react'
import { useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/common/components/ui/button'
import { cn } from '@/common/lib/utils'

import { EmptyList } from '../empty-states'

interface TableAction {
  key: string
  onPress: Function
  render: (args: { rowIndex: number; row: any; rows: any[] }) => ReactNode
}

// New props interface for TanStack table
interface TanStackEditableTableProps<T extends object, F extends ArrayPath<NoInfer<T>>> {
  keyboardNavigation?: boolean
  tableRef?: React.RefObject<HTMLDivElement>
  tabIndex?: number
  form: any
  name: F | string
  columnDefs: ColumnDef<any>[]
  className?: string
  errors?: any
  placeholder?: string
  onDelete?: (ctx: any) => void
  onDuplicate?: (ctx: any) => void
  onCreate?: (args: any) => void
  params?: Record<string, unknown>
  validate?: (ctx: any) => boolean
  methods?: React.RefObject<any>
  isRowVisible?: (args: any) => boolean
}

export const EditableTable = <T extends object, F extends ArrayPath<NoInfer<T>>>(
  props: TanStackEditableTableProps<T, F>
) => {
  const {
    keyboardNavigation = false,
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
    onDuplicate,
    validate,
    isRowVisible = () => true,
    params = {},
    methods
  } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLTableSectionElement>(null)
  const innerRef = useRef<HTMLTableElement>(null)
  const ref = tableRef || innerRef

  const [headerHeight, setHeaderHeight] = useState(0)

  const { t } = useTranslation()

  const fieldArray = useFieldArray({
    control: form.control,
    name
  })
  const fields = fieldArray.fields

  const rowVirtualizer = useVirtualizer({
    count: fields.length,
    getScrollElement: () => containerRef.current,
    overscan: 1,
    estimateSize: () => 40
  })

  useEffect(() => {
    const element = headerRef.current
    if (!element) return

    setHeaderHeight(element.offsetHeight)

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === element) {
          setHeaderHeight(entry.contentRect.height)
        }
      }
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [])
  useImperativeHandle(
    methods,
    () => ({
      scrollToRow: (rowIndex: number) => {
        const rowElement = ref.current?.querySelector(`[data-rowindex="${rowIndex}"]`)

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
      },
      updateColumnSize: (columnId: string, width: number) => {
        setColumnSizing((prev) => ({
          ...prev,
          [columnId]: Math.max(width, 50) // Ensure minimum width
        }))
      },
      resetColumnSizes: () => {
        setColumnSizing({})
      }
    }),
    []
  )

  const actions: TableAction[] = [
    {
      key: 'delete',
      onPress: onDelete,
      render: ({ rowIndex }) => (
        <Button
          tabIndex={tabIndex}
          type="button"
          variant="ghost"
          className="hover:bg-slate-50 hover:text-red-500 text-red-400"
          onClick={() => onDelete?.({ id: rowIndex, fieldArray })}
        >
          <CircleMinus className="btn-icon !mx-0" />
        </Button>
      )
    },
    {
      key: 'duplicate',
      onPress: onDuplicate,
      render: ({ rowIndex }) => (
        <Button
          tabIndex={tabIndex}
          type="button"
          variant="ghost"
          className="hover:bg-slate-50 text-brand"
          onClick={() =>
            onDuplicate?.({
              index: rowIndex,
              row: form.getValues(`${name}.${rowIndex}`),
              fieldArray
            })
          }
        >
          <CopyPlus className="btn-icon !mx-0" />
        </Button>
      )
    }
  ].filter((action) => Boolean(action.onPress)) as TableAction[]

  // Create columns for react-table
  const columns = useMemo(() => {
    const reactTableColumns: ColumnDef<any>[] = [
      // Line number column
      {
        id: 'line_number',
        header: () => '',
        size: 50,
        accessorFn: () => '',
        cell: ({ row }) => <div className="px-3 font-medium text-slate-500">{row.index + 1}</div>
      },
      // User-provided columns (already in TanStack format)
      ...columnDefs,
      // Action columns
      ...actions.map((action) => ({
        id: action.key,
        header: () => '',
        size: 53,
        accessorFn: () => '',
        cell: ({ row }: { row: Row<any> }) =>
          action.render({
            rowIndex: row.index,
            row: row.original,
            rows: fields
          })
      }))
    ]
    return reactTableColumns
  }, [columnDefs, actions, form, name, tabIndex, fields, errors, params, validate, t])

  // Column sizing state
  const [columnSizing, setColumnSizing] = useState<Record<string, number>>({})

  const table = useReactTable({
    data: fields,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
    state: {
      columnSizing
    },
    onColumnSizingChange: setColumnSizing,
    defaultColumn: {
      size: 100,
      minSize: 50,
      maxSize: 500
    }
  })

  // Calculate consistent column widths
  const columnWidths = useMemo(() => {
    const widths: Record<string, number> = {}
    table.getAllColumns().forEach((column) => {
      widths[column.id] = column.getSize()
    })
    return widths
  }, [table, columns])

  // Calculate total table width
  const totalWidth = useMemo(() => {
    return Object.values(columnWidths).reduce((sum, width) => sum + width, 0)
  }, [columnWidths])

  return (
    <div
      ref={containerRef}
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
      onKeyUp={(e) => {
        if (!keyboardNavigation) return
        if (e.target instanceof HTMLInputElement && e.key.startsWith('Arrow')) {
          e.preventDefault()
          const rowElement = e.target.closest('div[data-rowindex]')
          const cellElement = e.target.closest('div[data-cellindex]')

          if (!rowElement || !cellElement) return

          let rowIndex = Number(rowElement.getAttribute('data-rowindex') || 0)
          let cellIndex = Number(cellElement.getAttribute('data-cellindex') || 0)

          switch (e.key) {
            case 'ArrowDown':
              rowIndex += 1
              break
            case 'ArrowUp':
              rowIndex -= 1
              break
            case 'ArrowLeft':
              cellIndex -= 1
              break
            case 'ArrowRight':
              cellIndex += 1
              break
          }

          const nextRowElement = containerRef.current?.querySelector(
            `div[data-rowindex="${rowIndex}"]`
          )
          const nextCellElement = nextRowElement?.querySelector(
            `div[data-cellindex="${cellIndex}"]`
          )

          if (nextCellElement) {
            nextCellElement.querySelector('input')?.focus()
          }
        }
      }}
      style={
        {
          '--editable-table-header-height': `${headerHeight}px`
        } as CSSProperties
      }
      className="relative border border-blue-400 h-full overflow-y-auto"
    >
      <div style={{ height: `${headerHeight + rowVirtualizer.getTotalSize()}px` }}>
        {/* Table container */}
        <div
          ref={ref}
          className={cn('border border-slate-200 w-full h-full', className)}
        >
          {/* Header */}
          <div
            ref={headerRef}
            className="sticky top-0 z-[99] shadow-sm bg-white border-b"
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <div
                key={headerGroup.id}
                className="flex"
                style={{ width: totalWidth, minWidth: totalWidth }}
              >
                {headerGroup.headers.map((header) => (
                  <div
                    key={header.id}
                    className="px-3 py-2 border-r bg-gray-50 font-medium text-sm text-gray-700 flex items-center flex-shrink-0"
                    style={{
                      width: columnWidths[header.id],
                      minWidth: columnWidths[header.id],
                      maxWidth: columnWidths[header.id]
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="relative">
            {rowVirtualizer.getVirtualItems().length ? (
              rowVirtualizer.getVirtualItems().map((virtualItem) => {
                const row = table.getRowModel().rows[virtualItem.index]
                if (
                  !row ||
                  !isRowVisible({ row: row.original, index: virtualItem.index, rows: fields })
                ) {
                  return null
                }

                return (
                  <div
                    key={row.id}
                    data-rowindex={virtualItem.index}
                    className="flex absolute border-b hover:bg-gray-50"
                    style={{
                      width: totalWidth,
                      minWidth: totalWidth,
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`
                    }}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <div
                        key={cell.id}
                        data-cellindex={cellIndex}
                        className="px-3 py-2 border-r flex items-center flex-shrink-0"
                        style={{
                          width: columnWidths[cell.column.id],
                          minWidth: columnWidths[cell.column.id],
                          maxWidth: columnWidths[cell.column.id]
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    ))}
                  </div>
                )
              })
            ) : (
              <div className="flex justify-center items-center py-10">
                <EmptyList
                  iconProps={{
                    className: 'w-40'
                  }}
                >
                  {placeholder}
                </EmptyList>
              </div>
            )}
          </div>

          {/* Footer */}
          {typeof onCreate === 'function' && (
            <div className="sticky bottom-0 bg-white border-t">
              {typeof onCreate === 'function' && (
                <div className="flex">
                  <div className="w-full p-2">
                    <Button
                      tabIndex={tabIndex}
                      type="button"
                      variant="ghost"
                      className="w-full hover:bg-slate-50 text-brand hover:text-brand"
                      onClick={() => onCreate({ fieldArray })}
                    >
                      <CirclePlus className="btn-icon icon-start" /> {t('add')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
