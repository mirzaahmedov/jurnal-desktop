import type { KeyboardEventHandler } from 'react'

type SpravochnikKeyBindings = {
  open: KeyboardEventHandler
  clear: KeyboardEventHandler
}
const createSpravochnikKeyBindings = (handlers: SpravochnikKeyBindings): KeyboardEventHandler => {
  return (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault()
      handlers.open?.(e)
      return
    }
    if (e.key === 'Delete') {
      e.stopPropagation()
      e.preventDefault()
      handlers.clear?.(e)
      return
    }
  }
}

export { createSpravochnikKeyBindings }
