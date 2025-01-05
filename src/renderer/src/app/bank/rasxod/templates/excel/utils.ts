import { Cell, Worksheet } from 'exceljs'

export const inrange = (value: number, min: number, max: number) => {
  return value >= min && value <= max
}

export const array = (
  values: Record<number, unknown>,
  size = 12,
  defaultValue: unknown = undefined
): unknown[] => {
  const result = new Array(size)
  for (let i = 0; i < size; i++) {
    result[i] = values[i + 1] ?? defaultValue
  }
  return result
}

export const assign = <T>(obj: T | undefined, values: Partial<T>): T => {
  if (!obj) {
    return values as T
  }
  return Object.assign(obj, values)
}

export const drawBorder = (sheet: Worksheet, coords: [number, number, number, number]) => {
  const [startX, startY, endX, endY] = coords

  for (let i = startX; i <= endX; i++) {
    for (let j = startY; j <= endY; j++) {
      const cell = sheet.getCell(j, i)

      if (i === startX) {
        cell.border = assign(cell.border, { left: { style: 'thin' } })
      }
      if (i === endX) {
        cell.border = assign(cell.border, { right: { style: 'thin' } })
      }
      if (j === startY) {
        cell.border = assign(cell.border, { top: { style: 'thin' } })
      }
      if (j === endY) {
        cell.border = assign(cell.border, { bottom: { style: 'thin' } })
      }
    }
  }
}

export const textbox = (cell: Cell, centered = false) => {
  cell.style = assign(cell.style, {
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  })
  cell.font = assign(cell.font, {
    bold: false
  })
  if (centered) {
    cell.alignment = assign(cell.alignment, {
      vertical: 'middle',
      horizontal: 'center'
    })
  } else {
    cell.alignment = assign(cell.alignment, {
      vertical: 'top',
      horizontal: 'left'
    })
  }
}
