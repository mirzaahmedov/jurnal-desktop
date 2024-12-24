import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { TableCell, TableHead, TableRow } from '@/common/components/ui/table'

import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/common/lib/utils'
import { cva } from 'class-variance-authority'
import { forwardRef } from 'react'

const cellVariants = cva(
  '[&.stuck-right]:border-l !p-0 font-bold text-xs text-right border-r border-b last:border-r-0 font-medium text-slate-600 border-slate-200',
  {
    variants: {
      alphanumeric: {
        true: 'text-center'
      },
      sticky: {
        true: 'sticky left-0 bg-white font-extrabold z-50 overflow-y-clip'
      }
    }
  }
)

const ReportTableCell = ({
  children,
  alphanumeric,
  sticky,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & VariantProps<typeof cellVariants>) => {
  return (
    <TableCell
      {...props}
      className={cn(
        sticky && 'sticky-column',
        cellVariants({
          alphanumeric,
          sticky
        }),
        props.className
      )}
    >
      <div className="h-full w-full py-2 px-3 overflow-y-clip grid items-center [.stuck-left>&]:shadow-right [.stuck-right>&]:shadow-left">
        {children}
      </div>
    </TableCell>
  )
}

const headVariants = cva(
  'px-3 [&.stuck-right]:border-l [&.stuck-left]:shadow-right [&.stuck-right]:shadow-left font-bold text-2xs text-right border-r border-b last:border-r-0 text-foreground border-slate-200 uppercase whitespace-nowrap',
  {
    variants: {
      sticky: {
        true: 'sticky left-0 bg-white font-extrabold z-50'
      },
      alphanumeric: {
        true: 'text-center'
      }
    }
  }
)

const ReportTableHead = forwardRef<
  HTMLTableCellElement,
  ThHTMLAttributes<HTMLTableCellElement> & VariantProps<typeof headVariants>
>(({ children, alphanumeric, sticky, ...props }, ref) => {
  return (
    <TableHead
      {...props}
      ref={ref}
      className={cn(
        sticky && 'sticky-column',
        headVariants({
          alphanumeric,
          sticky
        }),
        props.className
      )}
    >
      {children}
    </TableHead>
  )
})
ReportTableHead.displayName = 'ReportTableHead'

const rowVariants = cva('group cursor-pointer hover:bg-white')

const ReportTableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ children, ...props }, ref) => {
    return (
      <TableRow
        {...props}
        ref={ref}
        className={cn(rowVariants(), props.className)}
      >
        {children}
      </TableRow>
    )
  }
)
ReportTableRow.displayName = 'ReportTableRow'

export { ReportTableCell, ReportTableHead, ReportTableRow }
