import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react'

import { cn } from '@/common/lib/utils'

import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '../ui/form'

export type FormElementProps = PropsWithChildren<{
  hideDescription?: boolean
  controlled?: boolean
  error?: boolean
  label: ReactNode
  grid?: `${number}:${number}`
  message?: string
  description?: string
  direction?: 'row' | 'column'
  className?: string
  divProps?: HTMLAttributes<HTMLDivElement>
  innerProps?: HTMLAttributes<HTMLDivElement>
  labelProps?: HTMLAttributes<HTMLLabelElement>
}>
export const FormElement = (props: FormElementProps) => {
  const {
    hideDescription = false,
    controlled = true,
    error = false,
    label,
    message,
    direction = 'row',
    children,
    grid,
    className,
    divProps,
    innerProps,
    description,
    labelProps
  } = props

  const cols = (grid?.split(':') ?? []).map(Number)
  const size = cols.length === 2 ? cols.reduce((acc, val) => acc + val, 0) : 0

  return (
    <FormItem className={className}>
      <div
        {...divProps}
        className={cn(
          'flex items-center gap-5',
          direction === 'column' && 'flex-col items-start gap-1.5',
          size > 0 && `grid gap-5`,
          divProps?.className
        )}
        style={{
          gridTemplateColumns: size > 0 ? `repeat(${size}, 1fr)` : undefined
        }}
      >
        <FormLabel
          {...labelProps}
          className={cn(
            size > 0 && 'text-right',
            error && 'text-destructive',
            labelProps?.className
          )}
          style={{
            gridColumn: size > 0 ? `span ${cols[0]} / span ${cols[0]}` : undefined,
            ...labelProps?.style
          }}
        >
          {label}
        </FormLabel>
        <div
          {...innerProps}
          className={cn('relative w-full flex-1 flex flex-col gap-1', innerProps?.className)}
          style={{
            gridColumn: size > 0 ? `span ${cols[1]} / span ${cols[1]}` : undefined
          }}
        >
          {controlled ? <FormControl>{children}</FormControl> : children}

          {message ? <FormMessage>{message}</FormMessage> : <FormMessage />}
        </div>
      </div>
      {!hideDescription ? (
        <>{description ? <FormDescription>{description}</FormDescription> : <FormDescription />}</>
      ) : null}
    </FormItem>
  )
}
