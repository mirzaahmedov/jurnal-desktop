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
  const [selected, setSelected] = useState<T | null>(null)

  const commandRef = useRef<HTMLDivElement>(null)
  const callbacksRef = useRef<Pick<AutoCompleteProps<T>, 'onSelect'>>({
    onSelect
  })
  callbacksRef.current = { onSelect }

  const toggle = useToggle()

  useLayoutEffect(() => {
    if (!Array.isArray(options)) {
      return
    }

    setSelected(options[0])
    if (options.length === 1) {
      callbacksRef.current?.onSelect?.(options[0])
    }
  }, [options])

  const open = toggle.isOpen && !disabled && Array.isArray(options) && options.length !== 1

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('running', e.key)
      if (e.key === 'ArrowUp') {
        const index = options.findIndex((elem) => elem.id === selected?.id)
        if (index > 0) {
          const newOption = options[index - 1]
          setSelected(newOption)
          scrollIntoElement(commandRef.current!, newOption?.id as number)
        }
        return
      }
      if (e.key === 'ArrowDown') {
        const index = options.findIndex((elem) => elem.id === selected?.id)
        if (index < options.length - 1) {
          const newOption = options[index + 1]
          setSelected(newOption)
          scrollIntoElement(commandRef.current!, newOption?.id as number)
        }
        return
      }
      if (e.key === 'Enter') {
        if (!selected) {
          return
        }
        callbacksRef.current.onSelect(selected)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [options, open, selected])

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
                  data-highlighted={selected?.id === item.id}
                  data-selected={selected?.id === item.id}
                  data-elementid={item.id}
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

const scrollIntoElement = (container: HTMLDivElement, id: number) => {
  const element = container.querySelector('[data-elementid="' + id + '"]')
  if (element) {
    element.scrollIntoView({
      block: 'nearest'
    })
  }
}

export { AutoComplete }
