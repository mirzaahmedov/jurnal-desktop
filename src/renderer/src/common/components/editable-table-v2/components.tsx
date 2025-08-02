import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/common/lib/utils'

export const EditableTableCell = ({
  children,
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <div
      {...props}
      className={cn(
        'border-r border-b border-slate-200 group-focus-within/row:border-highlight-divider bg-inherit p-px pt-0.5',
        className
      )}
    >
      {children}
    </div>
  )
}

export const EditableTableHead = ({
  children,
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <div
      {...props}
      className={cn(
        'px-3 py-3 border-r border-b border-slate-200 !bg-slate-100 text-foreground text-xs font-bold',
        className
      )}
    >
      {children}
    </div>
  )
}

const rowVariants = cva('flex scroll-my-32', {
  variants: {
    focusable: {
      true: 'w-full group/row hover:bg-highligth-neutral focus-within:bg-highlight hover:focus-within:bg-highlight'
    }
  },
  defaultVariants: {
    focusable: true
  }
})
export const EditableTableRow = ({
  children,
  className,
  focusable,
  rowRef,
  ...props
}: HTMLAttributes<HTMLTableRowElement> &
  VariantProps<typeof rowVariants> & {
    rowRef?: React.Ref<HTMLTableRowElement>
  }) => {
  return (
    <div
      {...props}
      ref={rowRef}
      className={cn(rowVariants({ className, focusable }), className)}
    >
      {children}
    </div>
  )
}
