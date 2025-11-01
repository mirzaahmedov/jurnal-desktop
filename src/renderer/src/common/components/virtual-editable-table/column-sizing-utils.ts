// Utility functions for dynamic column sizing

/**
 * Measures text width using Canvas API (most accurate)
 */
export const measureTextWidthCanvas = (
  text: string,
  fontSize = '14px',
  fontFamily = 'system-ui, sans-serif'
): number => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (context) {
    context.font = `${fontSize} ${fontFamily}`
    return context.measureText(text).width
  }

  return 0
}

/**
 * Measures text width using DOM element (alternative method)
 */
export const measureTextWidthDOM = (
  text: string,
  fontSize = '14px',
  fontFamily = 'system-ui, sans-serif'
): number => {
  const tempElement = document.createElement('span')
  tempElement.style.fontSize = fontSize
  tempElement.style.fontFamily = fontFamily
  tempElement.style.visibility = 'hidden'
  tempElement.style.position = 'absolute'
  tempElement.style.whiteSpace = 'nowrap'
  tempElement.textContent = text

  document.body.appendChild(tempElement)
  const width = tempElement.offsetWidth
  document.body.removeChild(tempElement)

  return width
}

/**
 * Calculates optimal column width with padding
 */
export const calculateOptimalWidth = (
  textWidth: number,
  minWidth: number,
  maxWidth: number = 500,
  padding: number = 48
): number => {
  return Math.min(Math.max(textWidth + padding, minWidth), maxWidth)
}

/**
 * Debounced column size updater to prevent excessive updates
 */
export const createDebouncedColumnSizer = (
  updateFunction: (columnId: string, width: number) => void,
  delay: number = 100
) => {
  const timeouts = new Map<string, NodeJS.Timeout>()

  return (columnId: string, width: number) => {
    // Clear existing timeout for this column
    if (timeouts.has(columnId)) {
      clearTimeout(timeouts.get(columnId))
    }

    // Set new timeout
    const timeoutId = setTimeout(() => {
      updateFunction(columnId, width)
      timeouts.delete(columnId)
    }, delay)

    timeouts.set(columnId, timeoutId)
  }
}
