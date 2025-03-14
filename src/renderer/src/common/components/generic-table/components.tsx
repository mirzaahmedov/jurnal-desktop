import type { VariantProps } from 'class-variance-authority'
import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'

import { forwardRef } from 'react'

import { cva } from 'class-variance-authority'

import { TableCell, TableHead, TableRow } from '@/common/components/ui/table'
import { cn } from '@/common/lib/utils'

const cellVariants = cva(
  'px-6 py-4 border-r border-b font-medium text-slate-600 border-slate-200',
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
  'px-6 py-4 text-xs font-extrabold border-r border-b !bg-transparent text-foreground border-slate-200',
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

const rowVariants = cva('cursor-pointer even:bg-slate-50 hover:bg-white even:hover:bg-slate-50')

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
