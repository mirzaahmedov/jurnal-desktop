import type { ColumnDef, LeafColumnDef, NestedKeys } from './interfaces'

export const getMaxDepth = <T extends object>(columns: ColumnDef<T>[], depth = 1): number => {
  return columns.reduce((max, col) => {
    if (col.columns) {
      return Math.max(max, getMaxDepth(col.columns, depth + 1))
    }
    return max
  }, depth)
}

export const getLeafColumns = <T extends object>(columns: ColumnDef<T>[]): LeafColumnDef<T>[] => {
  return columns.flatMap((col) => (col.columns ? getLeafColumns(col.columns) : [col]))
}

export const getValueByAccessor = <T extends object>(obj: T, accessor: NestedKeys<T>): any => {
  return (accessor as string).split('.').reduce((val: any, key: any) => val?.[key], obj)
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
