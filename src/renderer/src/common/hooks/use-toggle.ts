import { useCallback, useState } from 'react'

export const useToggle = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((prev) => prev)
  }, [])

  return {
    isOpen,
    setIsOpen,
    open,
    close,
    toggle
  }
}
