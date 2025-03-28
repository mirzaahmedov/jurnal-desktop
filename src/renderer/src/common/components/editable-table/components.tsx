import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'

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
        'border-r border-b border-slate-200 group-hover/row:bg-slate-50 p-px pt-0.5',
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

export const EditableTableRow = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) => {
  return (
    <TableRow
      {...props}
      className={cn('group/row data-[blurred=true]:blur-sm hover:bg-white', className)}
    >
      {children}
    </TableRow>
  )
}
