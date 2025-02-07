import {
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'

import { Command, CommandEmpty, CommandItem, CommandList } from '@/common/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover'
import { useEventCallback, useToggle } from '@/common/hooks'

import { LoadingSpinner } from './loading'

type AutoCompleteProps<T> = PropsWithChildren<{
  isFetching: boolean
  disabled?: boolean
  value?: unknown
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
  value,
  getOptionLabel,
  getOptionValue,
  onSelect,
  className,
  children
}: AutoCompleteProps<T>) => {
  const [selected, setSelected] = useState<T | null>(null)

  const commandRef = useRef<HTMLDivElement>(null)

  const onSelectEvent = useEventCallback(onSelect)
  const getOptionValueCallback = useEventCallback(getOptionValue)

  const toggle = useToggle()

  useLayoutEffect(() => {
    if (!Array.isArray(options)) {
      return
    }

    setSelected(options[0])
    if (options.length === 1) {
      onSelectEvent?.(options[0])
    }
  }, [options, onSelectEvent])

  const open = toggle.isOpen && !disabled && Array.isArray(options) && options.length !== 1

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selected || !open) {
        return
      }
      if (e.key === 'ArrowUp') {
        const index = options.findIndex(
          (elem) => getOptionValueCallback(elem) === getOptionValueCallback(selected)
        )
        if (index > 0) {
          const newOption = options[index - 1]
          setSelected(newOption)
          scrollIntoElement(commandRef.current!, getOptionValueCallback(newOption))
        }
        return
      }
      if (e.key === 'ArrowDown') {
        const index = options.findIndex(
          (elem) => getOptionValueCallback(elem) === getOptionValueCallback(selected)
        )
        if (index < options.length - 1) {
          const newOption = options[index + 1]
          setSelected(newOption)
          scrollIntoElement(commandRef.current!, getOptionValueCallback(newOption))
        }
        return
      }
      if (e.key === 'Enter') {
        onSelectEvent?.(selected)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [options, open, selected, getOptionValueCallback])

  return (
    <Popover
      open={open}
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
        onCloseAutoFocus={(e) => e.preventDefault()}
        align="start"
        className="w-[var(--radix-popover-trigger-width)]"
      >
        <Command
          ref={commandRef}
          shouldFilter={false}
        >
          <CommandList>
            <CommandEmpty autoFocus={false}>Ничего не найдено</CommandEmpty>
            {isFetching ? (
              <CommandItem
                disabled
                className="flex justify-center"
              >
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
