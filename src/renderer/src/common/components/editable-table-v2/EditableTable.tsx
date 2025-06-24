import type { ColumnDef, LeafColumnDef, SortDirection } from './types'

import {
  CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  type RefObject,
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'

import { t } from 'i18next'
import { ArrowDown01, ArrowDown10, Copy, Ellipsis, Filter, Plus, Trash2 } from 'lucide-react'
import {
  Controller,
  type FieldErrors,
  type FieldValues,
  type SetValueConfig,
  type UseFormReturn,
  useFieldArray,
  useWatch
} from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { FixedSizeList } from 'react-window'

import { AutoSizer } from '@/common/components/auto-sizer'
import { Menu, MenuItem, MenuPopover, MenuTrigger } from '@/common/components/jolly/menu'
import { cn } from '@/common/lib/utils'

import { Debouncer } from '../debouncer'
import { Button } from '../jolly/button'
import { getLeafColumns, getMaximumColumnDepth, handleStickyColumns } from './utils'

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
export const EditableTable = memo(
  <TForm extends FieldValues, TName extends ArrayPath<TForm>>({
    form,
    name,
    methods,
    tableRef,
    columnDefs,
    defaultValues
  }: EditableTableProps<TForm, TName>) => {
    const ref = useRef<HTMLDivElement>(null)
    const scrollerRef = useRef<HTMLDivElement>()
    const listRef = useRef<FixedSizeList>(null)
    const activeRowIndex = useRef<number | null>(null)

    const [filtering, setFiltering] = useState<
      Partial<Record<keyof GetFieldType<TForm, TName>, string>>
    >({})
    const [isFilterVisible, setFilterVisible] = useState(false)

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

    useImperativeHandle(tableRef, () => ref.current!)
    useImperativeHandle(methods, () => ({
      scrollToRow: (rowIndex: number) => {
        listRef.current?.scrollToItem(rowIndex, 'smart')

        const inputElement = ref.current?.querySelector(
          `[data-rowindex="${rowIndex}"] input`
        ) as HTMLInputElement
        if (inputElement) {
          inputElement.focus({
            preventScroll: true
          })
          activeRowIndex.current = null
        } else {
          activeRowIndex.current = rowIndex
        }
      }
    }))

    const handleTriggerSort = (
      column: ColumnDef<GetFieldType<TForm, TName>>,
      direction: SortDirection
    ) => {
      const sortedFields = [...rows].sort((aRow, bRow) => {
        const columnKey = column.key as keyof GetFieldType<TForm, TName>
        const sortFn = column.sortFn

        const aValue = aRow[columnKey]
        const bValue = bRow[columnKey]

        let comparison = 0
        if (sortFn) {
          comparison = sortFn(aRow, bRow, direction)
        } else {
          if (direction === 'asc') {
            comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
          } else if (direction === 'desc') {
            comparison = aValue > bValue ? -1 : aValue < bValue ? 1 : 0
          }
        }

        return comparison
      })

      if (!sortedFields.every((field, index) => field.id === rows[index].id)) {
        replaceRows(sortedFields)
      }
    }

    const handleToggleFilter = () => {
      setFilterVisible((prev) => {
        const newValue = !prev
        if (!newValue) {
          setFiltering({})
        }
        return newValue
      })
    }

    const handleFilter = (column: string, value: string) => {
      setFiltering((prev) => ({
        ...prev,
        [column]: value
      }))
    }

    const handleAppendRow = () => {
      appendRow(defaultValues)
      listRef.current?.scrollToItem(rows.length, 'smart')
    }

    const getRowValuesByIndex = (index: number) => {
      return form.watch(`${String(name)}.${index}` as any) as GetFieldType<TForm, TName>
    }
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

    const filteredIndexes = useMemo(
      () =>
        rows
          .map((row, index) => ({ ...row, index }))
          .filter((_, index) => {
            return columnDefs.every((column) => {
              const filterValue = filtering[column.key]
              if (!column.filter || !filterValue) {
                return true
              }

              if (column.filterFn) {
                const row = getRowValuesByIndex(index)
                return column.filterFn(filterValue, row)
              } else {
                const value = getRowValuesByIndex(index)[column.key]

                return (
                  String(value).toLowerCase().includes(filterValue.toLowerCase()) ||
                  String(value).includes(filterValue)
                )
              }
            })
          })
          .map(({ index }) => index),
      [rows, JSON.stringify(filtering), columnDefs]
    )
    const leafColumnDefs = useMemo(() => getLeafColumns(columnDefs), [columnDefs])
    const indexDigitsCount = String(rows.length).length
    const gridTemplateColumns = useMemo(() => {
      const template = leafColumnDefs.map((column) => {
        if (column.size) {
          return `${column.size}px`
        } else if (column.minSize && column.maxSize) {
          return `minmax(${column.minSize}px, ${column.maxSize}px)`
        } else if (column.minSize) {
          return `minmax(${column.minSize}px, 1fr)`
        } else if (column.maxSize) {
          return `max-content`
        }
        return '1fr'
      })

      template.unshift(`${indexDigitsCount + 3 * 18}px`)
      template.push('80px')

      return template.join(' ')
    }, [leafColumnDefs, indexDigitsCount])
    const maxDepth = useMemo(() => getMaximumColumnDepth(columnDefs), [columnDefs])

    return (
      <div
        ref={ref}
        className="divide-y border-y w-full h-full overflow-hidden flex flex-col text-sm"
      >
        <div
          onScroll={(e) => {
            handleStickyColumns(e.currentTarget)
          }}
          ref={(ref) => {
            if (ref) {
              scrollerRef.current = ref
              handleStickyColumns(ref)
            }
          }}
          className="flex-1 min-h-0 w-full overflow-x-auto overflow-y-hidden scrollbar whitespace-nowrap"
        >
          <div className="h-full w-full min-w-min flex flex-col">
            <div
              className="grid bg-gray-100 text-gray-700 border-b border-gray-300 shadow-sm overflow-y-scroll scrollbar"
              style={{ gridTemplateColumns }}
            >
              <Header
                style={{
                  gridColumn: `1 / 2`,
                  gridRow: `1 / ${maxDepth + 1}`
                }}
                data-sticky={true}
                data-left={0}
                className="z-50"
              />
              {columnDefs.map((column, index) => (
                <HeaderCell
                  key={index}
                  column={column}
                  depth={1}
                  maxDepth={maxDepth}
                  startCol={
                    leafColumnDefs
                      .slice(0, index)
                      .reduce((acc, c) => acc + getLeafColumns([c]).length, 1) + 1
                  }
                  isFilterVisible={isFilterVisible}
                  onFilter={handleFilter}
                  onSort={handleTriggerSort}
                  filtering={filtering}
                />
              ))}
              <Header
                style={{
                  gridColumn: `${leafColumnDefs.length + 2} / -1`,
                  gridRow: `1 / ${maxDepth + 1}`,
                  minWidth: `80px`,
                  backgroundImage: 'inherit'
                }}
                data-sticky={true}
                data-right={0}
                className="z-50"
              >
                <div className="h-full py-2 mx-auto">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleToggleFilter}
                    className={cn(
                      'mx-auto group transition-colors',
                      isFilterVisible ? 'bg-brand/5 hover:!bg-brand/5' : ''
                    )}
                  >
                    <Filter
                      className={cn(
                        'size-5 font-bold group-hover:text-brand transition-colors',
                        isFilterVisible ? 'text-brand' : ''
                      )}
                    />
                  </Button>
                </div>
              </Header>
            </div>
            <AutoSizer>
              {({ height, ref: bodyRef }) => (
                <div
                  ref={bodyRef}
                  id="et-body"
                  className="flex-1 w-full overflow-hidden"
                >
                  <FixedSizeList
                    ref={listRef}
                    itemCount={filteredIndexes.length}
                    itemSize={31}
                    overscanCount={10}
                    width="auto"
                    height={height}
                    style={{
                      overflowX: 'hidden',
                      overflowY: 'scroll',
                      width: 'auto'
                    }}
                    className="scrollbar"
                    onItemsRendered={() => {
                      if (activeRowIndex.current !== null) {
                        const rowElement = ref.current?.querySelector(
                          `[data-rowindex="${activeRowIndex.current}"]`
                        ) as HTMLDivElement | null
                        if (rowElement) {
                          const inputElement = rowElement.querySelector(
                            'input, textarea, select'
                          ) as HTMLInputElement | null
                          if (inputElement) {
                            inputElement.focus({ preventScroll: true })
                            activeRowIndex.current = null
                          }
                        }
                      }
                    }}
                    onScroll={() => {
                      if (scrollerRef.current) {
                        handleStickyColumns(scrollerRef.current)
                      }
                    }}
                  >
                    {({ index, style }) => {
                      return (
                        <RowRenderer
                          index={index}
                          style={style}
                          filteredIndexes={filteredIndexes}
                          rows={rows}
                          gridTemplateColumns={gridTemplateColumns}
                          leafColumnDefs={leafColumnDefs}
                          form={form}
                          name={name}
                          setRowValuesByIndex={setRowValuesByIndex}
                          insertRow={insertRow}
                          removeRow={removeRow}
                        />
                      )
                    }}
                  </FixedSizeList>
                </div>
              )}
            </AutoSizer>
          </div>
        </div>
        <div>
          <Button
            type="button"
            variant="ghost"
            onClick={handleAppendRow}
            className="w-full rounded-none font-semibold"
          >
            <Plus className="btn-icon icon-start" /> {t('add')}
          </Button>
        </div>
      </div>
    )
  }
) as <TForm extends FieldValues, TName extends ArrayPath<TForm>>(
  props: EditableTableProps<TForm, TName>
) => ReactNode

interface HeaderCellProps<T extends object> {
  column: ColumnDef<T>
  depth: number
  minSize?: number
  maxDepth: number
  startCol: number
  isFilterVisible: boolean
  filtering: Partial<Record<keyof T, string>>
  onSort: (column: ColumnDef<T>, direction: SortDirection) => void
  onFilter: (column: keyof T & string, value: string) => void
}
const HeaderCell = <T extends object>({
  column,
  maxDepth,
  depth,
  startCol,
  isFilterVisible,
  filtering,
  onSort,
  onFilter
}: HeaderCellProps<T>) => {
  const { t } = useTranslation()

  const leafCount = column.columns ? getLeafColumns(column.columns).length : 1
  const colSpan = leafCount
  const rowSpan = column.columns ? 1 : maxDepth - depth + 1

  return (
    <>
      <Header
        data-colkey={column.key}
        data-sticky={column.sticky ? true : undefined}
        data-left={column.left !== undefined ? column.left : undefined}
        data-right={column.right !== undefined ? column.right : undefined}
        style={{
          gridColumn: `${startCol} / span ${colSpan}`,
          gridRow: `${depth} / span ${rowSpan}`,
          minWidth: column.minSize
        }}
      >
        <div className="w-full">
          <div className="w-full flex flex-row items-center justify-between gap-2">
            <div className="flex-1">
              {typeof column.header === 'function' ? (
                column.header()
              ) : (
                <Trans>{column.header}</Trans>
              )}
            </div>
            {column.sort ? (
              <MenuTrigger>
                <Button
                  size="icon"
                  variant="ghost"
                  className="p-1"
                >
                  <Ellipsis className="btn-icon" />
                </Button>
                <MenuPopover>
                  <Menu>
                    <MenuItem
                      onAction={() => onSort(column, 'asc')}
                      className="cursor-pointer"
                    >
                      <ArrowDown01 className="btn-icon text-gray-700" /> {t('sort_asc')}
                    </MenuItem>
                    <MenuItem
                      onAction={() => onSort(column, 'desc')}
                      className="cursor-pointer"
                    >
                      <ArrowDown10 className="btn-icon text-gray-700" />
                      {t('sort_desc')}
                    </MenuItem>
                  </Menu>
                </MenuPopover>
              </MenuTrigger>
            ) : null}
          </div>
          {column.filter && isFilterVisible ? (
            <div className="w-full">
              <Debouncer
                value={filtering[column.key] ?? ''}
                onChange={(value) => onFilter(column.key, value)}
              >
                {({ value, onChange }) => (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="p-1 w-full text-base outline-brand font-normal"
                  />
                )}
              </Debouncer>
            </div>
          ) : null}
        </div>
      </Header>
      {
        column.columns?.reduce(
          (acc, child) => {
            const childStart = startCol + acc.totalLeafCount
            const childResult = (
              <HeaderCell
                key={`${child.header}-${childStart}`}
                column={child}
                depth={depth + 1}
                maxDepth={maxDepth}
                startCol={childStart}
                isFilterVisible={isFilterVisible}
                filtering={filtering}
                onSort={onSort}
                onFilter={onFilter}
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

const Header = ({ children, className, ...props }: InputHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'p-2 text-xs uppercase font-bold border-b border-r text-gray-600 flex items-center bg-inherit',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
const Cell = ({ children, className, ...props }: InputHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('border-b border-r bg-inherit', className)}
      {...props}
    >
      {children}
    </div>
  )
}

const Row = forwardRef<HTMLDivElement, InputHTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('bg-white', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

interface RowRendererProps<
  TForm extends FieldValues,
  TName extends ArrayPath<TForm> = ArrayPath<TForm> & string
> {
  index: number
  style: CSSProperties
  filteredIndexes: number[]
  rows: GetFieldType<TForm, TName>[]
  gridTemplateColumns: string
  leafColumnDefs: LeafColumnDef<GetFieldType<TForm, TName>>[]
  form: UseFormReturn<TForm>
  name: TName
  setRowValuesByIndex: (
    index: number,
    values: GetFieldType<TForm, TName>,
    options?: SetValueConfig
  ) => void
  insertRow: (index: number, values: GetFieldType<TForm, TName>) => void
  removeRow: (index: number) => void
}
const RowRenderer = memo(
  <TForm extends FieldValues, TName extends ArrayPath<TForm> = ArrayPath<TForm> & string>({
    index,
    style,
    filteredIndexes,
    rows,
    gridTemplateColumns,
    leafColumnDefs,
    form,
    name,
    setRowValuesByIndex,
    insertRow,
    removeRow
  }: RowRendererProps<TForm, TName>) => {
    const rowIndex = filteredIndexes[index]
    const rowField = rows[rowIndex]

    const rowValues = useWatch({
      control: form.control,
      name: `${String(name)}.${rowIndex}` as any
    })

    return (
      <Row
        key={rowField.id}
        data-rowindex={rowIndex}
        className="grid focus-visible:bg-blue-200 focus-within:bg-gray-100"
        style={{
          ...style,
          width: '100%',
          gridTemplateColumns
        }}
      >
        <Cell
          data-sticky={true}
          data-left={0}
          className="z-50 px-1.5 flex items-center justify-center"
        >
          {rowIndex + 1}
        </Cell>
        {leafColumnDefs.map((column) => (
          <Cell
            key={column.key}
            data-colkey={column.key}
            data-sticky={column.sticky ? true : undefined}
            data-left={column.left !== undefined ? column.left : undefined}
            data-right={column.right !== undefined ? column.right : undefined}
          >
            <Controller
              name={`${String(name)}.${rowIndex}.${column.key}` as any}
              control={form.control}
              render={({ field, fieldState, formState }) => {
                const rowErrors = formState.errors[
                  `${String(name)}.${rowIndex}` as any
                ] as FieldErrors<GetFieldType<TForm, TName>>

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
                  <div style={{ height: 30 }}>
                    {column.render({
                      rowIndex,
                      inputRef: field.ref,
                      form,
                      value: field.value,
                      error: fieldState.error,
                      rowErrors,
                      column,
                      rowValues,
                      setRowValues,
                      setRowFieldValue,
                      onChange: field.onChange
                    })}
                  </div>
                )
              }}
            />
          </Cell>
        ))}
        <Cell
          data-sticky={true}
          data-right={0}
          className="z-50"
        >
          <div className="px-2 h-full flex items-center gap-0.5">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-7"
              onClick={() => {
                insertRow(rowIndex, form.getValues(`${String(name)}.${rowIndex}` as any))
              }}
            >
              <Copy className="btn-icon text-gray-700" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-7"
              onClick={() => {
                removeRow(rowIndex)
              }}
            >
              <Trash2 className="btn-icon text-red-500" />
            </Button>
          </div>
        </Cell>
      </Row>
    )
  }
) as <TForm extends FieldValues, TName extends ArrayPath<TForm>>(
  props: RowRendererProps<TForm, TName> & { ref?: Ref<HTMLDivElement> }
) => ReactNode
