import type { PropsWithChildren, ReactNode } from 'react'

import { cn } from '@/common/lib/utils'

export interface SummaTotalProps extends PropsWithChildren {
  className?: string
}
export const SummaTotal = ({ children, className }: SummaTotalProps) => {
  return (
    <div className={cn('w-full grid grid-cols-3 items-center gap-20', className)}>{children}</div>
  )
}

export interface SummaTotalValueProps {
  name: ReactNode
  value: ReactNode
  className?: string
}
const SummaTotalValue = ({ name, value, className }: SummaTotalValueProps) => {
  return (
    <div className={cn('flex items-center gap-5', className)}>
      <span className="text-sm text-slate-400">{name}</span>
      <b className="font-black text-slate-700">{value}</b>
    </div>
  )
}

SummaTotal.Value = SummaTotalValue
