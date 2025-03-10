import type { SmetaGrafik } from '@/common/models'
import type { MouseEvent, RefObject, UIEvent } from 'react'

import { createRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { LoadingOverlay } from '@/common/components'
import { Table, TableBody, TableHeader } from '@/common/components/ui/table'
import { formatNumber } from '@/common/lib/format'
import { parseCSSNumericValue } from '@/common/lib/utils'

import { columns } from './columns'
import { SmetaTableCell, SmetaTableHead, SmetaTableRow } from './table-components'

const stickyColumns = columns.filter((column) => column.sticky)

const SCROLL_INTERVAL = 15
const SCROLL_STEP = 15
const SCROLL_AREA_WIDTH = 400

type SmetaTableProps = {
  isLoading: boolean
  data: SmetaGrafik[]
  onEdit: (row: SmetaGrafik) => void
  onDelete: (row: SmetaGrafik) => void
}
const SmetaTable = ({ isLoading, data, onEdit, onDelete }: SmetaTableProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<{
    direction: 'left' | 'right'
    interval: NodeJS.Timeout
  } | null>(null)

  const { t } = useTranslation()

  const [tableRef] = useState(createRef<HTMLTableElement>())
  const [columnRefs] = useState<RefObject<HTMLTableCellElement>[]>(
    Array.from({
      length: stickyColumns.length
    }).map(() => createRef<HTMLTableCellElement>())
  )
  const [columnWidths, setColumnWidths] = useState<number[]>(
    Array.from({
      length: stickyColumns.length
    }).map(() => 0)
  )

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { clientX, currentTarget } = e
    const { x, width } = currentTarget.getBoundingClientRect()

    const xCoord = clientX - x

    switch (true) {
      case xCoord < SCROLL_AREA_WIDTH:
        if (scrollRef.current?.direction === 'left') {
          return
        }
        if (scrollRef.current) {
          clearInterval(scrollRef.current.interval)
        }
        scrollRef.current = {
          interval: setInterval(() => {
            ref.current?.scrollBy({
              left: SCROLL_STEP * -1
            })
          }, SCROLL_INTERVAL),
          direction: 'left'
        }
        break
      case xCoord > width - SCROLL_AREA_WIDTH:
        if (scrollRef.current?.direction === 'right') {
          return
        }
        if (scrollRef.current) {
          clearInterval(scrollRef.current.interval)
        }
        scrollRef.current = {
          interval: setInterval(() => {
            ref.current?.scrollBy({
              left: SCROLL_STEP
            })
          }, SCROLL_INTERVAL),
          direction: 'right'
        }
        break
      default:
        if (scrollRef.current) {
          clearInterval(scrollRef.current?.interval)
        }
    }
  }
  const setColumnShadows = useCallback(
    (currentTarget: HTMLDivElement | null) => {
      if (!currentTarget || !tableRef.current) {
        return
      }

      const { scrollLeft, scrollWidth, clientWidth } = currentTarget
      const { x: containerX, width: containerWidth } = currentTarget.getBoundingClientRect()

      const columnsState = columnRefs.map((columnRef) => {
        if (!columnRef.current) {
          return
        }
        const { x, width } = columnRef.current.getBoundingClientRect()
        const leftOffset = x - containerX
        const rightOffset = containerWidth - width - (x - containerX)

        switch (true) {
          case leftOffset <= parseCSSNumericValue(columnRef.current.style.left) && scrollLeft > 0:
            return 'left'
          case rightOffset <= parseCSSNumericValue(columnRef.current.style.right) &&
            scrollWidth - clientWidth - scrollLeft > 0:
            return 'right'
          default:
            return
        }
      })

      updateTableColumns(tableRef.current, columnsState)
    },
    [columnRefs, tableRef]
  )
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget
    if (scrollLeft === 0 && scrollWidth - clientWidth - scrollLeft === 0 && scrollRef.current) {
      clearInterval(scrollRef.current.interval)
      scrollRef.current = null
    }

    setColumnShadows(e.currentTarget)
  }
  const handleMouseLeave = () => {
    if (scrollRef.current) {
      clearInterval(scrollRef.current.interval)
      scrollRef.current = null
    }
  }

  useLayoutEffect(() => {
    const handleResize = () => {
      setColumnWidths(columnRefs.map((ref) => ref.current?.offsetWidth || 0))
      setColumnShadows(ref.current)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [data, columnRefs, setColumnShadows])
  useEffect(() => {
    return () => {
      if (scrollRef.current) {
        clearInterval(scrollRef.current.interval)
      }
    }
  }, [])

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-x-auto noscroll-bar"
    >
      {isLoading ? <LoadingOverlay /> : null}
      <Table
        ref={tableRef}
        className="border-separate border-spacing-0 overflow-clip h-px"
      >
        <TableHeader>
          <SmetaTableRow>
            {columns.map((column) => {
              if (!column.sticky) {
                return (
                  <SmetaTableHead
                    key={column.key}
                    alphanumeric={column.alphanumeric}
                    className={column.className}
                  >
                    {t(column.header)}
                  </SmetaTableHead>
                )
              }
              const index = stickyColumns.indexOf(column)

              const leftOffset = columnWidths.slice(0, index).reduce((acc, width) => acc + width, 0)
              const rightOffset = columnWidths
                .slice(index + 1)
                .reduce((acc, width) => acc + width, 0)

              return (
                <SmetaTableHead
                  key={column.key}
                  alphanumeric={column.alphanumeric}
                  sticky={true}
                  ref={columnRefs[index]}
                  className={column.className}
                  style={{
                    left: leftOffset,
                    right: rightOffset
                  }}
                >
                  {t(column.header)}
                </SmetaTableHead>
              )
            })}
          </SmetaTableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((row) => (
              <SmetaTableRow key={row.id}>
                {columns.map((column) => {
                  if (!column.sticky) {
                    return (
                      <SmetaTableCell
                        key={column.key}
                        alphanumeric={column.alphanumeric}
                        className={column.className}
                      >
                        {column.cellElement ? (
                          <column.cellElement
                            row={row}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        ) : !column.alphanumeric ? (
                          formatNumber(Number(row[column.key as keyof SmetaGrafik] || '0'))
                        ) : (
                          row[column.key as keyof SmetaGrafik]
                        )}
                      </SmetaTableCell>
                    )
                  }

                  const index = stickyColumns.indexOf(column)

                  const leftOffset = columnWidths
                    .slice(0, index)
                    .reduce((acc, width) => acc + width, 0)
                  const rightOffset = columnWidths
                    .slice(index + 1)
                    .reduce((acc, width) => acc + width, 0)

                  return (
                    <SmetaTableCell
                      key={column.key}
                      alphanumeric={column.alphanumeric}
                      sticky={true}
                      style={{
                        left: leftOffset,
                        right: rightOffset
                      }}
                      className={column.className}
                    >
                      {column.cellElement ? (
                        <column.cellElement
                          row={row}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      ) : !column.alphanumeric ? (
                        formatNumber(Number(row[column.key as keyof SmetaGrafik] || '0'))
                      ) : (
                        row[column.key as keyof SmetaGrafik]
                      )}
                    </SmetaTableCell>
                  )
                })}
              </SmetaTableRow>
            ))
          ) : (
            <SmetaTableRow className="pointer-events-none">
              <SmetaTableCell
                className="w-full text-center py-20 text-slate-400"
                colSpan={1000}
              >
                Нет данных для отображения
              </SmetaTableCell>
            </SmetaTableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const updateTableColumns = (table: HTMLTableElement, state: ('left' | 'right' | undefined)[]) => {
  const theadRow = table.querySelector('thead>tr')
  const tbodyRows = table.querySelectorAll('tbody>tr')

  const firstRightColumnIndex = state.indexOf('right')
  const lastLeftColumnIndex = state.lastIndexOf('left')

  const updateRowCells = (cells?: NodeListOf<Element>) => {
    if (!cells) {
      return
    }

    cells.forEach((td, index) => {
      const column = state[index]
      if (index === firstRightColumnIndex || index === lastLeftColumnIndex) {
        td.classList.add(column === 'left' ? 'stuck-left' : 'stuck-right')
      } else {
        td.classList.remove('stuck-left', 'stuck-right')
      }
    })
  }

  updateRowCells(theadRow?.querySelectorAll('th.sticky-column'))
  tbodyRows.forEach((row) => {
    updateRowCells(row.querySelectorAll('td.sticky-column'))
  })
}

export { SmetaTable }
export type { SmetaTableProps }
