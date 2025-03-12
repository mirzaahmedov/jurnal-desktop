import type { TooltipContentProps } from '@radix-ui/react-tooltip'
import type { HTMLAttributes, ReactNode } from 'react'

import { Portal } from '@radix-ui/react-tooltip'

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
  titleProps?: HTMLAttributes<HTMLHeadingElement>
  secondaryTextProps?: HTMLAttributes<HTMLHeadingElement>
  hoverContent?: ReactNode
  hoverContentProps?: TooltipContentProps
}
export const HoverInfoCell = ({
  title,
  secondaryText,
  titleProps,
  secondaryTextProps,
  hoverContent,
  hoverContentProps = {},
  ...props
}: HoverInfoCellProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div {...props}>
            <h6
              {...titleProps}
              className={cn('text-sm font-bold leading-none', titleProps?.className)}
            >
              {title}
            </h6>
            {secondaryText ? (
              <p
                {...secondaryTextProps}
                className={cn(
                  'mt-2 text-brand text-xs font-bold leading-none',
                  secondaryTextProps?.className
                )}
              >
                {secondaryText}
              </p>
            ) : null}
          </div>
        </TooltipTrigger>
        {hoverContent ? (
          <Portal>
            <TooltipContent
              align="center"
              onClick={(e) => e.stopPropagation()}
              {...hoverContentProps}
              className={cn('bg-white shadow-xl p-5 min-w-96', hoverContentProps.className)}
            >
              {hoverContent}
            </TooltipContent>
          </Portal>
        ) : null}
      </Tooltip>
    </TooltipProvider>
  )
}
