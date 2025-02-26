import type { TooltipContentProps } from '@radix-ui/react-tooltip'
import type { HTMLAttributes, ReactNode } from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/common/components/ui/tooltip'
import { cn } from '@/common/lib/utils'

export interface HoverInfoCellProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode
  secondaryText?: ReactNode
  hoverContent: ReactNode
  hoverContentProps?: TooltipContentProps
}
export const HoverInfoCell = ({
  title,
  secondaryText,
  hoverContent,
  hoverContentProps = {},
  ...props
}: HoverInfoCellProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div {...props}>
            <h6 className="text-sm font-bold leading-none">{title}</h6>
            {secondaryText ? (
              <p className="mt-0.5 text-slate-400 text-xs font-medium leading-none">
                {secondaryText}
              </p>
            ) : null}
          </div>
        </TooltipTrigger>
        <TooltipContent
          align="center"
          onClick={(e) => e.stopPropagation()}
          {...hoverContentProps}
          className={cn('bg-white shadow-xl p-5', hoverContentProps.className)}
        >
          {hoverContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
