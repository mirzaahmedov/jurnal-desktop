import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react'

import { Label } from '@/common/components/jolly/field'
import { cn } from '@/common/lib/utils'

export type FormElementProps = PropsWithChildren<{
  error?: boolean
  label: ReactNode
  grid?: `${number}:${number}`
  direction?: 'row' | 'column'
  divProps?: HTMLAttributes<HTMLDivElement>
  innerProps?: HTMLAttributes<HTMLDivElement>
  labelProps?: HTMLAttributes<HTMLLabelElement>
}>
export const FormElementUncontrolled = (props: FormElementProps) => {
  const {
    error = false,
    label,
    direction = 'row',
    children,
    grid,
    divProps,
    innerProps,
    labelProps
  } = props

  const cols = (grid?.split(':') ?? []).map(Number)
  const size = cols.length === 2 ? cols.reduce((acc, val) => acc + val, 0) : 0

  return (
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
      <Label
        {...labelProps}
        className={cn(size > 0 && 'text-right', error && 'text-destructive', labelProps?.className)}
        style={{
          gridColumn: size > 0 ? `span ${cols[0]} / span ${cols[0]}` : undefined,
          ...labelProps?.style
        }}
      >
        {label}
      </Label>
      <div
        {...innerProps}
        className={cn('relative w-full flex-1 flex flex-col gap-1', innerProps?.className)}
        style={{
          gridColumn: size > 0 ? `span ${cols[1]} / span ${cols[1]}` : undefined
        }}
      >
        {children}
      </div>
    </div>
  )
}
