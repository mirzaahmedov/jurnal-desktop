import type { ReactNode } from 'react'

import { Check } from 'lucide-react'

import { useToggle } from '@/common/hooks/use-toggle'
import { cn } from '@/common/lib/utils'

import { Spinner } from './loading'
import { Command, CommandInput, CommandItem, CommandList } from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export type ComboboxProps = {
  children: ReactNode
  loading?: boolean
  options: string[]
  value: string
  onChange?: (value: string) => void
}
export const Combobox = ({
  children,
  loading = false,
  options,
  value,
  onChange
}: ComboboxProps) => {
  const { isOpen: active, close, setOpen: setActive } = useToggle()
  return (
    <Popover
      open={active}
      onOpenChange={setActive}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent
        className="p-0"
        side="top"
      >
        {loading ? (
          <Spinner />
        ) : (
          <Command>
            <CommandInput />
            <CommandList>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={(value) => {
                    onChange?.(value)
                    close()
                  }}
                  className={cn(
                    'text-slate-600 font-medium data-[selected=true]:text-slate-600',
                    value === option && 'font-bold text-brand pointer-events-none hover:text-brand'
                  )}
                >
                  <Check
                    className={cn('mr-2 h-4 w-4', value === option ? 'opacity-100' : 'opacity-0')}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  )
}
