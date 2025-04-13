'use client'

import * as React from 'react'

import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/common/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/common/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover'
import { cn } from '@/common/lib/utils'

const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js'
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit'
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js'
  },
  {
    value: 'remix',
    label: 'Remix'
  },
  {
    value: 'astro',
    label: 'Astro'
  }
]

export const Select = () => {
  const commandRef = React.useRef<HTMLDivElement>(null)

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] px-3 !text-sm hover:text-slate-600 hover:bg-transparent justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : 'Select framework...'}
          <ChevronsUpDown className="opacity-50 size-3 text-sm" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[200px] p-0"
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          commandRef.current?.focus()
        }}
      >
        <Command
          ref={commandRef}
          className="focus:outline-none"
        >
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === framework.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
