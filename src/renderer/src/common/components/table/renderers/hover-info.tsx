import type { HTMLAttributes, ReactNode } from 'react'

import { Pressable, type TooltipProps } from 'react-aria-components'

import { Tooltip, TooltipTrigger } from '@/common/components/jolly/tooltip'
import { cn } from '@/common/lib/utils'

export interface HoverInfoCellProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode
  secondaryText?: ReactNode
  titleProps?: HTMLAttributes<HTMLHeadingElement>
  secondaryTextProps?: HTMLAttributes<HTMLHeadingElement>
  tooltipContent?: ReactNode
  tooltipProps?: TooltipProps
}
export const HoverInfoCell = ({
  title,
  secondaryText,
  titleProps,
  secondaryTextProps,
  tooltipContent,
  tooltipProps = {},
  ...props
}: HoverInfoCellProps) => {
  return (
    <TooltipTrigger delay={100}>
      <Pressable onPress={(e) => e.continuePropagation()}>
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
                'mt-2 text-brand text-xs font-bold leading-none h-3',
                secondaryTextProps?.className
              )}
            >
              {secondaryText}
            </p>
          ) : null}
        </div>
      </Pressable>
      {tooltipContent ? (
        <Tooltip
          {...tooltipProps}
          crossOffset={0}
          className={cn('bg-white shadow-xl p-5 min-w-96 max-w-2xl', tooltipProps.className)}
        >
          {tooltipContent}
        </Tooltip>
      ) : null}
    </TooltipTrigger>
  )
}
