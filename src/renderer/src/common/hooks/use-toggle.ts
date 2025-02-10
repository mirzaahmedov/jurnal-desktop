import { type Dispatch, type SetStateAction, useCallback, useState } from 'react'

export interface UseToggleReturn {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  open: VoidFunction
  close: VoidFunction
  toggle: VoidFunction
}

export const useToggle = (initialState: boolean = false): UseToggleReturn => {
  const [isOpen, setOpen] = useState(initialState)

  const open = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  const close = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const toggle = useCallback(() => {
    setOpen((prev) => prev)
  }, [setOpen])

  return {
    isOpen,
    setOpen,
    open,
    close,
    toggle
  }
}
