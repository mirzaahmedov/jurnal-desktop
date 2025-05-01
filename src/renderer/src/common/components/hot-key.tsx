import type { HTMLAttributes } from 'react'

import { cn } from '@/common/lib/utils'

export const HotKey = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <span
      className={cn(
        'text-slate-500 text-xs font-semibold rounded-md px-1.5 py-0.5 bg-slate-200',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
