import type { PropsWithChildren } from 'react'

import { cn } from '@/common/lib/utils'

import { FormControl, FormItem, FormLabel, FormMessage } from '../ui/form'

export type FormElementProps = PropsWithChildren<{
  controlled?: boolean
  error?: boolean
  label: string
  grid?: `${number}:${number}`
  message?: string
  direction?: 'row' | 'column'
  className?: string
}>
export const FormElement = (props: FormElementProps) => {
  const {
    controlled = true,
    error = false,
    label,
    message,
    direction = 'row',
    children,
    grid,
    className
  } = props

  const cols = (grid?.split(':') ?? []).map(Number)
  const size = cols.length === 2 ? cols.reduce((acc, val) => acc + val, 0) : 0

  return (
    <FormItem className={className}>
      <div
        className={cn(
          'flex items-center gap-5',
          direction === 'column' && 'flex-col items-start gap-1.5',
          size > 0 && `grid gap-5`
        )}
        style={{
          gridTemplateColumns: size > 0 ? `repeat(${size}, 1fr)` : undefined
        }}
      >
        <FormLabel
          className={cn(size > 0 && 'text-right', error && 'text-destructive')}
          style={{
            gridColumn: size > 0 ? `span ${cols[0]} / span ${cols[0]}` : undefined
          }}
        >
          {label}
        </FormLabel>
        <div
          className={cn('relative w-full flex-1 flex flex-col gap-1')}
          style={{
            gridColumn: size > 0 ? `span ${cols[1]} / span ${cols[1]}` : undefined
          }}
        >
          {controlled ? <FormControl>{children}</FormControl> : children}

          {message ? (
            <FormMessage className="absolute left-0 top-full translate-y-0.5">
              {message}
            </FormMessage>
          ) : (
            <FormMessage className="absolute left-0 top-full translate-y-0.5" />
          )}
        </div>
      </div>
    </FormItem>
  )
}
