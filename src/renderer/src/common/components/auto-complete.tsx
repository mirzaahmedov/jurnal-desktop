import { type PropsWithChildren, type ReactNode, useLayoutEffect, useRef } from 'react'

import { Command, CommandEmpty, CommandItem, CommandList } from '@/common/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover'
import { useToggle } from '@/common/hooks'

import { LoadingSpinner } from './loading'

type AutoCompleteProps<T> = PropsWithChildren<{
  isFetching: boolean
  disabled?: boolean
  options: T[]
  getOptionLabel: (option: T) => ReactNode
  getOptionValue: (option: T) => string
  onSelect: (option: T) => void
  className?: string
}>
const AutoComplete = <T extends Record<string, unknown>>({
  isFetching,
  disabled,
  options,
  getOptionLabel,
  getOptionValue,
  onSelect,
  className,
  children
}: AutoCompleteProps<T>) => {
  const callbacksRef = useRef<Pick<AutoCompleteProps<T>, 'onSelect'>>({
    onSelect
  })
  callbacksRef.current = { onSelect }

  const toggle = useToggle()

  useLayoutEffect(() => {
    if (!Array.isArray(options)) {
      return
    }
    if (options.length === 1) {
      callbacksRef.current?.onSelect?.(options[0])
    }
  }, [options])

  return (
    <Popover
      open={toggle.isOpen && !disabled && Array.isArray(options) && options.length !== 1}
      modal={true}
    >
      <PopoverTrigger
        className={className}
        onFocus={(e) => {
          ;(e.target.children[0] as HTMLInputElement)?.focus?.()
          toggle.open()
        }}
        onBlur={() => {
          toggle.close()
        }}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        align="start"
        className="w-[var(--radix-popover-trigger-width)]"
      >
        <Command shouldFilter={false}>
          <CommandList>
            <CommandEmpty autoFocus={false}>Ничего не найдено</CommandEmpty>
            {isFetching ? (
              <CommandItem disabled className="flex justify-center">
                <LoadingSpinner />
              </CommandItem>
            ) : Array.isArray(options) ? (
              options.map((item) => (
                <CommandItem
                  key={getOptionValue(item)}
                  onSelect={() => {
                    onSelect(item)
                    toggle.close()
                  }}
                  className="break-all"
                >
                  {getOptionLabel(item)}
                </CommandItem>
              ))
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { AutoComplete }
