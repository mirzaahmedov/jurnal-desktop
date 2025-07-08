import type { ThHTMLAttributes } from 'react'

import { cva } from 'class-variance-authority'

import { cn } from '@/common/lib/utils'

const editorHeaderCellVariants = cva(
  'bg-gray-200 border border-gray-300 text-xs font-medium text-gray-600 text-center'
)

export const EditorHeaderCell = ({
  children,
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <th
      className={cn(editorHeaderCellVariants(), className)}
      {...props}
    >
      {children}
    </th>
  )
}
