import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'

import { cn } from '@/common/lib/utils'
import { TableCell, TableHead, TableRow } from '@/common/components/ui/table'

export const EditableTableCell = ({
  children,
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <TableCell
      {...props}
      className={cn('p-0 border-r border-slate-200 last:border-none', className)}
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
      className={cn('px-3 border-r border-slate-200 last:border-none', className)}
    >
      {children}
    </TableHead>
  )
}

export const EditableTableRow = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) => {
  return (
    <TableRow {...props} className={cn('hover:bg-white', className)}>
      {children}
    </TableRow>
  )
}
