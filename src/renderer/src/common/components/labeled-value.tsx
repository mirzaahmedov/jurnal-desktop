import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/common/lib/utils'

export interface LabeledValueProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode
  value: ReactNode
}
export const LabeledValue = ({ label, value, className, ...props }: LabeledValueProps) => {
  return (
    <div
      className={cn('flex flex-col space-y-1', className)}
      {...props}
    >
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  )
}
