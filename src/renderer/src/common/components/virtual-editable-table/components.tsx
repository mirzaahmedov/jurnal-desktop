import type { HTMLAttributes, Ref, TdHTMLAttributes, ThHTMLAttributes } from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/common/lib/utils'

import { headVariants } from '../generic-table'

export const TableCell = ({
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

export const TableHead = ({
  children,
  className,
  elementRef,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement> & { elementRef?: Ref<HTMLTableCellElement> }) => {
  return (
    <div
      {...props}
      ref={elementRef}
      className={cn(
        headVariants(),
        'px-3 border-r border-b border-slate-200 !bg-slate-100 text-foreground text-xs font-bold',
        className
      )}
    >
      {children}
    </div>
  )
}

const rowVariants = cva('', {
  variants: {
    focusable: {
      true: 'grid divide-x text-center bg-white border-t group/row hover:bg-highligth-neutral focus-within:bg-highlight hover:focus-within:bg-highlight'
    }
  },
  defaultVariants: {
    focusable: true
  }
})

export interface TableRowProps
  extends HTMLAttributes<HTMLTableRowElement>,
    VariantProps<typeof rowVariants> {
  rowRef?: React.Ref<HTMLTableRowElement>
}
export const TableRow = ({ children, className, focusable, rowRef, ...props }: TableRowProps) => {
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
