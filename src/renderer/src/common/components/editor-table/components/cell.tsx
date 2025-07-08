import type { TdHTMLAttributes } from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/common/lib/utils'

const cellVariants = cva(
  'group min-w-24 h-8 border border-gray-300 p-0 relative cursor-cell focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-inset focus-within:bg-blue-50',
  {
    variants: {
      error: {
        true: 'ring-2 ring-red-500 ring-inset bg-red-50'
      }
    }
  }
)

export const EditorCell = ({
  children,
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & VariantProps<typeof cellVariants>) => {
  return (
    <td
      {...props}
      className={cn(cellVariants(), className)}
    >
      {children}
    </td>
  )
}
