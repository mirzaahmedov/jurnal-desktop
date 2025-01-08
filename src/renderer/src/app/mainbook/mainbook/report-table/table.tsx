import type { MouseEvent, RefObject, UIEvent } from 'react'
import { ReportTableCell, ReportTableHead, ReportTableRow } from './table-components'
import { Table, TableBody, TableHeader } from '@renderer/common/components/ui/table'
import { cn, parseCSSNumericValue } from '@renderer/common/lib/utils'
import { createRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { LoadingOverlay } from '@renderer/common/components'
import type { Mainbook } from '@renderer/common/models'
import { MainbookTableRow } from '../details/utils'
import { columns } from './columns'
import { formatNumber } from '@renderer/common/lib/format'

const stickyColumns = columns.filter((column) => column.sticky)

const SCROLL_INTERVAL = 15
const SCROLL_STEP = 15
const SCROLL_AREA_WIDTH = 400

type ReportTableProps = {
  isLoading: boolean
  data: MainbookTableRow[]
  onEdit: (row: MainbookTableRow) => void
  onDelete: (row: MainbookTableRow) => void
}
const ReportTable = ({ isLoading, data, onEdit, onDelete }: ReportTableProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<{
    direction: 'left' | 'right'
    interval: NodeJS.Timeout
  } | null>(null)

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
      className="relative h-full w-full overflow-x-auto noscroll-bar"
    >
      {isLoading ? <LoadingOverlay className="z-[51]" /> : null}
      <Table
        ref={tableRef}
        className="relative h-full border-separate border-spacing-0"
      >
        <TableHeader className="sticky top-0 z-[100]">
          <ReportTableRow className="bg-slate-100">
            {columns.map((column) => {
              if (column.hidden) {
                return null
              }

              if (!column.sticky) {
                return (
                  <ReportTableHead
                    key={String(column.key)}
                    alphanumeric={column.alphanumeric}
                    rowSpan={column.rowSpan}
                    colSpan={column.colSpan}
                    className={cn('text-center', column.className)}
                  >
                    {column.header}
                  </ReportTableHead>
                )
              }
              const index = stickyColumns.indexOf(column)

              const leftOffset = columnWidths.slice(0, index).reduce((acc, width) => acc + width, 0)
              const rightOffset = columnWidths
                .slice(index + 1)
                .reduce((acc, width) => acc + width, 0)

              return (
                <ReportTableHead
                  key={String(column.key)}
                  alphanumeric={column.alphanumeric}
                  sticky={true}
                  rowSpan={column.rowSpan}
                  colSpan={column.colSpan}
                  ref={columnRefs[index]}
                  className={cn('text-center', column.className)}
                  style={{
                    left: leftOffset,
                    right: rightOffset
                  }}
                >
                  {column.header}
                </ReportTableHead>
              )
            })}
          </ReportTableRow>
          <ReportTableRow className="bg-slate-100">
            {Array(11)
              .fill(null)
              .map(() => (
                <>
                  <ReportTableHead className="text-center">кредит</ReportTableHead>
                  <ReportTableHead className="text-center">дебет</ReportTableHead>
                </>
              ))}
          </ReportTableRow>
        </TableHeader>
        <TableBody className="[&>tr:last-child>td]:!font-extrabold">
          {Array.isArray(data) && data.length > 0 ? (
            data.map((row) => (
              <ReportTableRow
                key={row.id}
                className="[&:nth-child(2n)>td]:!bg-slate-50"
              >
                {columns.map((column) => {
                  if (!column.sticky) {
                    return (
                      <ReportTableCell
                        key={String(column.key)}
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
                          formatNumber(
                            Number(row[column.key as keyof Mainbook.ReportPreviewProvodka] || '0')
                          )
                        ) : (
                          row[column.key as keyof Mainbook.ReportPreviewProvodka]
                        )}
                      </ReportTableCell>
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
                    <ReportTableCell
                      key={String(column.key)}
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
                        formatNumber(
                          Number(row[column.key as keyof Mainbook.ReportPreviewProvodka] || '0')
                        )
                      ) : (
                        row[column.key as keyof Mainbook.ReportPreviewProvodka]
                      )}
                    </ReportTableCell>
                  )
                })}
              </ReportTableRow>
            ))
          ) : (
            <ReportTableRow className="pointer-events-none">
              <ReportTableCell
                className="w-full text-center py-20 text-slate-400"
                colSpan={1000}
              >
                Нет данных для отображения
              </ReportTableCell>
            </ReportTableRow>
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

export { ReportTable }
export type { ReportTableProps }
