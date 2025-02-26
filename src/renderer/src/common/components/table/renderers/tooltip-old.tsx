import type { TooltipContentProps } from '@radix-ui/react-tooltip'
import type { HTMLAttributes, ReactNode } from 'react'

import { Copyable } from '@/common/components'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/common/components/ui/tooltip'
import { cn } from '@/common/lib/utils'

export interface TooltipCellProps<T> extends TooltipContentProps, HTMLAttributes<HTMLDivElement> {
  data: T
  title: string
  description?: keyof T
  elements: Partial<Record<keyof T, ReactNode>>
}
export const TooltipCell = <T,>({
  data,
  title,
  description,
  elements,
  className,
  ...props
}: TooltipCellProps<T>) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div>
            <h6 className="text-sm font-bold leading-none">{title}</h6>
            <p className="mt-0.5 text-slate-400 text-xs font-medium leading-none">
              {description && data[description] ? (
                <>
                  <span>{elements[description]}:</span>{' '}
                  <Copyable value={String(data[description])}>
                    <span>{String(data[description])}</span>
                  </Copyable>
                </>
              ) : null}
            </p>
          </div>
        </TooltipTrigger>
        <TooltipContent
          align="center"
          onClick={(e) => e.stopPropagation()}
          className={cn('bg-white shadow-xl p-5', className)}
          {...props}
        >
          <ul>
            <h6 className="text-sm font-bold mb-2 text-foreground">{title}</h6>
            {Object.entries(elements).map((entry) => {
              const [key, value] = entry as [keyof T, ReactNode]
              return (
                <li
                  key={String(key)}
                  className="flex items-center gap-2 text-slate-600"
                >
                  <span className="w-40 text-slate-500 font-medium">{value}:</span>
                  <span className="flex-1 font-bold text-foreground">
                    <Copyable value={data[key] ? String(data[key]) : '-'}>
                      {data[key] ? String(data[key]) : '-'}
                    </Copyable>
                  </span>
                </li>
              )
            })}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
