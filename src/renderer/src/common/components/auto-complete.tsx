import type { PopoverContentProps } from '@radix-ui/react-popover'

import { type KeyboardEvent, type ReactNode, useLayoutEffect, useRef, useState } from 'react'

import { Command, CommandEmpty, CommandItem, CommandList } from '@/common/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover'
import { type UseToggleReturn, useEventCallback, useToggle } from '@/common/hooks'
import { cn } from '@/common/lib/utils'

import { EmptyList } from './empty-states'
import { Spinner } from './loading'

interface AutoCompleteProps<T> {
  isFetching: boolean
  disabled?: boolean
  autoSelectSingleResult?: boolean
  value?: unknown
  options: T[]
  getOptionLabel: (option: T) => ReactNode
  getOptionValue: (option: T) => string
  onSelect: (option: T) => void
  className?: string
  popoverProps?: PopoverContentProps
  children: (toggle: UseToggleReturn) => ReactNode
}
const AutoComplete = <T extends object>({
  isFetching,
  disabled,
  autoSelectSingleResult = true,
  options,
  value,
  getOptionLabel,
  getOptionValue,
  onSelect,
  className,
  children,
  popoverProps = {}
}: AutoCompleteProps<T>) => {
  const commandRef = useRef<HTMLDivElement>(null)

  const popoverToggle = useToggle()
  const onSelectEvent = useEventCallback(onSelect)

  const [selected, setSelected] = useState<T | null>(null)

  useLayoutEffect(() => {
    if (!Array.isArray(options)) {
      return
    }
    setSelected(options[0])
  }, [options, onSelectEvent])
  useLayoutEffect(() => {
    if (Array.isArray(options) && options.length === 1 && autoSelectSingleResult) {
      onSelectEvent?.(options[0])
    }
  }, [options, onSelectEvent, autoSelectSingleResult])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selected || !open) {
      return
    }
    if (e.key === 'ArrowUp') {
      const index = options.findIndex((elem) => getOptionValue(elem) === getOptionValue(selected))
      if (index > 0) {
        const newOption = options[index - 1]
        setSelected(newOption)
        scrollIntoElement(commandRef.current!, getOptionValue(newOption))
      }
      return
    }
    if (e.key === 'ArrowDown') {
      const index = options.findIndex((elem) => getOptionValue(elem) === getOptionValue(selected))
      if (index < options.length - 1) {
        const newOption = options[index + 1]
        setSelected(newOption)
        scrollIntoElement(commandRef.current!, getOptionValue(newOption))
      }
      return
    }
    if (e.key === 'Enter') {
      onSelectEvent?.(selected)
    }
  }

  const open = popoverToggle.isOpen && !disabled

  return (
    <Popover
      open={open}
      onOpenChange={popoverToggle.setOpen}
      modal={true}
    >
      <PopoverTrigger
        className={className}
        onFocus={(e) => {
          const input = e.target.querySelector('input')
          input?.focus?.()
        }}
        onKeyDown={handleKeyDown}
      >
        {children(popoverToggle)}
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        align="start"
        {...popoverProps}
        className={cn('w-[var(--radix-popover-trigger-width)]', popoverProps.className)}
      >
        <Command
          ref={commandRef}
          shouldFilter={false}
        >
          <CommandList>
            <CommandEmpty
              autoFocus={false}
              className="text-sm text-center"
            >
              <EmptyList iconProps={{ className: 'w-32' }} />
            </CommandEmpty>
            {isFetching ? (
              <CommandItem
                disabled
                className="flex justify-center"
              >
                <Spinner />
              </CommandItem>
            ) : Array.isArray(options) ? (
              options.map((item) => (
                <CommandItem
                  key={getOptionValue(item)}
                  onSelect={() => {
                    onSelect(item)
                    popoverToggle.close()
                  }}
                  className="break-all"
                  data-highlighted={
                    selected ? getOptionValue(selected) === getOptionValue(item) : false
                  }
                  data-selected={
                    selected ? getOptionValue(selected) === getOptionValue(item) : false
                  }
                  data-elementid={getOptionValue(item)}
                  disabled={value === getOptionValue(item)}
                >
                  {value === getOptionValue(item) ? '✓' : null} {getOptionLabel(item)}
                </CommandItem>
              ))
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const scrollIntoElement = (container: HTMLDivElement, id: unknown) => {
  const element = container.querySelector('[data-elementid="' + id + '"]')
  if (element) {
    element.scrollIntoView({
      block: 'nearest'
    })
  }
}

export { AutoComplete }
