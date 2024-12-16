import type { KeyboardEvent } from 'react'

type RegisterKeyBindingsParams = {
  open?: (e?: KeyboardEvent) => void
  clear?: (e?: KeyboardEvent) => void
}
const registerKeyBindings = ({ open, clear }: RegisterKeyBindingsParams) => {
  return {
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.stopPropagation()
        e.preventDefault()
        open?.(e)
        return
      }
      if (e.key === 'Delete') {
        e.stopPropagation()
        e.preventDefault()
        clear?.(e)
        return
      }
    }
  }
}

export { registerKeyBindings }
