import type { HTMLAttributes } from 'react'

import { cn } from '@/common/lib/utils'

export const HotKey = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <span
      className={cn(
        'text-slate-500 text-2xs font-semibold rounded px-1 py-0.5 bg-slate-200',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
