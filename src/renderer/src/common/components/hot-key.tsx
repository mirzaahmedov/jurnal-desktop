import type { HTMLAttributes } from 'react'

import { cn } from '@/common/lib/utils'

export const HotKey = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <span
      className={cn(
        'text-slate-500 text-xs font-semibold rounded px-2 py-1 bg-slate-200',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
