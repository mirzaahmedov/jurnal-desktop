import type { PopoverContentProps } from '@radix-ui/react-popover'

import { type KeyboardEvent, type ReactNode, useLayoutEffect, useRef, useState } from 'react'

import { Pressable } from 'react-aria-components'

import { Popover, PopoverDialog, PopoverTrigger } from '@/common/components/jolly/popover'
import { Command, CommandEmpty, CommandItem, CommandList } from '@/common/components/ui/command'
import { type UseToggleReturn, useEventCallback, useToggle } from '@/common/hooks'
import { cn } from '@/common/lib/utils'

import { EmptyList } from './empty-states'
import { Spinner } from './loading'

interface AutoCompleteNewProps<T> {
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
export const AutoCompleteNew = <T extends object>({
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
}: AutoCompleteNewProps<T>) => {
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

  console.log({ open, disabled })

  return (
    <PopoverTrigger
      isOpen={open}
      onOpenChange={popoverToggle.setOpen}
    >
      <Pressable>
        <>{children(popoverToggle)}</>
      </Pressable>
      <Popover
        isNonModal
        align="start"
        {...popoverProps}
        className={cn('w-[var(--radix-popover-trigger-width)]', popoverProps.className)}
      >
        <PopoverDialog>
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
        </PopoverDialog>
      </Popover>
    </PopoverTrigger>
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
