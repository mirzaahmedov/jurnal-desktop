import type { VariantProps } from 'class-variance-authority'
import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'

import { forwardRef } from 'react'

import { cva } from 'class-variance-authority'

import { TableCell, TableHead, TableRow } from '@/common/components/ui/table'
import { cn } from '@/common/lib/utils'

export const cellVariants = cva(
  'px-6 py-4 border-r border-b font-medium text-slate-600 border-slate-200',
  {
    variants: {
      fit: {
        true: 'whitespace-nowrap w-0'
      },
      fill: {
        true: 'w-full'
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
  fill,
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
          fill,
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

export const headVariants = cva(
  'select-none relative px-6 py-4 text-xs font-extrabold border-r border-b !bg-transparent text-foreground border-slate-200',
  {
    variants: {
      fit: {
        true: 'whitespace-nowrap w-full w-0'
      },
      fill: {
        true: 'w-full'
      },
      stretch: {
        true: 'whitespace-nowrap w-full'
      },
      numeric: {
        true: 'text-right whitespace-nowrap w-0'
      },
      sort: {
        true: 'hover:!bg-slate-200/50 transition-colors cursor-pointer'
      }
    }
  }
)

export const GenericTableHead = ({
  fit,
  fill,
  stretch,
  numeric,
  sort,
  children,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement> & VariantProps<typeof headVariants>) => {
  return (
    <TableHead
      {...props}
      className={cn(
        headVariants({
          fit,
          fill,
          stretch,
          numeric,
          sort
        }),
        props.className
      )}
    >
      {children}
    </TableHead>
  )
}

export const rowVariants = cva(
  'cursor-pointer bg-white even:bg-slate-50 hover:bg-white even:hover:bg-slate-50'
)

export const GenericTableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
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
