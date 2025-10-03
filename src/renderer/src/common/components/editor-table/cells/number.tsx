import type { CustomCellRendererProps } from 'ag-grid-react'
import type { HTMLAttributes } from 'react'

import { formatNumber } from '@/common/lib/format'
import { cn } from '@/common/lib/utils'

export const numberCell = ({
  value,
  className,
  ...props
}: CustomCellRendererProps & HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('block text-right', className)}
      {...props}
    >
      {formatNumber(value)}
    </span>
  )
}
