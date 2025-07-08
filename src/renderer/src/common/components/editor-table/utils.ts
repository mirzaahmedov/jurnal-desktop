import type { ColumnDef, LeafColumnDef } from './types'

export const getLeafColumns = <T extends object>(columns: ColumnDef<T>[]): LeafColumnDef<T>[] => {
  return columns.flatMap((column) =>
    column.columns ? getLeafColumns(column.columns) : [column as LeafColumnDef<T>]
  )
}

export const getMaximumColumnDepth = <T extends object>(
  columns: ColumnDef<T>[],
  depth = 1
): number => {
  return columns.reduce((max, col) => {
    if (col.columns) {
      return Math.max(max, getMaximumColumnDepth(col.columns, depth + 1))
    }
    return max
  }, depth)
}

export const handleStickyColumns = (container?: HTMLDivElement) => {
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

export const focusRowInputElementByIndex = (container: HTMLDivElement | null, index: number) => {
  if (!container) return

  const rowElement = container.querySelector(`[data-rowindex="${index}"]`) as HTMLDivElement | null
  if (!rowElement) return
  const inputElement = rowElement.querySelector(
    'input, textarea, select'
  ) as HTMLInputElement | null
  if (inputElement) {
    inputElement.focus({ preventScroll: true })
  }
}

export const flattenColumns = <T extends object>(
  columns: ColumnDef<T>[],
  depth = 0,
  result: ColumnDef<T>[][] = [],
  row = 0
) => {
  columns.forEach((col) => {
    const colSpan = getColSpan(col)
    const rowSpan = col.columns ? 1 : depth - row
    if (!result[row]) result[row] = []

    result[row].push({
      ...col,
      _colSpan: colSpan,
      _rowSpan: rowSpan
    })

    if (col.columns) {
      flattenColumns(col.columns, depth, result, row + 1)
    }
  })

  return result
}

export const getColSpan = <T extends object>(col: ColumnDef<T>): number => {
  if (!col.columns) return 1
  return col.columns.reduce((sum, child) => sum + getColSpan(child), 0)
}
