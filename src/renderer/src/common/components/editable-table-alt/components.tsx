import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import { TableCell, TableHead, TableRow } from '@/common/components/ui/table'
import { cn } from '@/common/lib/utils'

export const EditableTableCell = ({
  children,
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <TableCell
      {...props}
      className={cn(
        'border-r border-b border-slate-200 group-focus-within/row:border-highlight-divider bg-inherit p-px pt-0.5',
        className
      )}
    >
      {children}
    </TableCell>
  )
}

export const EditableTableHead = ({
  children,
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <TableHead
      {...props}
      className={cn(
        'px-3 border-r border-b border-slate-200 !bg-slate-100 text-foreground text-xs font-bold',
        className
      )}
    >
      {children}
    </TableHead>
  )
}

const rowVariants = cva('', {
  variants: {
    focusable: {
      true: 'group/row hover:bg-highligth-neutral focus-within:bg-highlight hover:focus-within:bg-highlight'
    }
  },
  defaultVariants: {
    focusable: true
  }
})

export interface EditableTableRowProps
  extends HTMLAttributes<HTMLTableRowElement>,
    VariantProps<typeof rowVariants> {
  rowRef?: React.Ref<HTMLTableRowElement>
}
export const EditableTableRow = ({
  children,
  className,
  focusable,
  rowRef,
  ...props
}: EditableTableRowProps) => {
  return (
    <TableRow
      {...props}
      ref={rowRef}
      className={cn(rowVariants({ className, focusable }), className)}
    >
      {children}
    </TableRow>
  )
}
