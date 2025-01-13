import { useCallback, useState } from 'react'

export const useToggle = (initialState: boolean = false) => {
  const [isOpen, setOpen] = useState(initialState)

  const open = useCallback(() => {
    setOpen(true)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
  }, [])

  const toggle = useCallback(() => {
    setOpen((prev) => prev)
  }, [])

  return {
    isOpen,
    setOpen,
    open,
    close,
    toggle
  }
}
