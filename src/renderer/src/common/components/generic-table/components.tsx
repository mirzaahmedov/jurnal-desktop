import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import type { VariantProps } from 'class-variance-authority'

import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/common/lib/utils'
import { TableCell, TableHead, TableRow } from '@/common/components/ui/table'

const cellVariants = cva(
  'px-6 py-4 border-r last:border-none font-medium text-slate-600 border-slate-200',
  {
    variants: {
      fit: {
        true: 'whitespace-nowrap w-0'
      },
      stretch: {
        true: 'whitespace-nowrap w-full'
      },
      numeric: {
        true: 'text-right'
      }
    }
  }
)

export const GenericTableCell = ({
  fit,
  stretch,
  numeric,
  children,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & VariantProps<typeof cellVariants>) => {
  return (
    <TableCell
      {...props}
      className={cn(
        cellVariants({
          fit,
          stretch,
          numeric
        }),
        props.className
      )}
    >
      {children}
    </TableCell>
  )
}

const headVariants = cva(
  'px-6 py-4 text-xs font-extrabold border-r last:border-none bg-transparent text-foreground border-slate-200',
  {
    variants: {
      fit: {
        true: 'whitespace-nowrap w-full w-0'
      },
      stretch: {
        true: 'whitespace-nowrap w-full'
      },
      numeric: {
        true: 'text-right whitespace-nowrap w-0'
      }
    }
  }
)

export const GenericTableHead = ({
  fit,
  stretch,
  numeric,
  children,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement> & VariantProps<typeof headVariants>) => {
  return (
    <TableHead
      {...props}
      className={cn(
        headVariants({
          fit,
          stretch,
          numeric
        }),
        props.className
      )}
    >
      {children}
    </TableHead>
  )
}

const rowVariants = cva(
  'cursor-pointer !border-b border-slate-200 even:bg-slate-50 hover:bg-white even:hover:bg-slate-50'
)

export const GenericTableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ children, ...props }, ref) => {
    return (
      <TableRow {...props} ref={ref} className={cn(rowVariants(), props.className)}>
        {children}
      </TableRow>
    )
  }
)
