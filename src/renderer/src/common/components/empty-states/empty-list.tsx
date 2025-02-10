import type { HTMLAttributes, SVGAttributes } from 'react'

import { cn } from '@renderer/common/lib/utils'
import { useTranslation } from 'react-i18next'

import { EmptyInbox } from './empty-inbox'

export interface EmptyListProps extends HTMLAttributes<HTMLDivElement> {
  iconProps?: SVGAttributes<SVGElement>
}
export const EmptyList = ({ children, className, iconProps, ...props }: EmptyListProps) => {
  const { t } = useTranslation()
  return (
    <div
      className={cn('flex flex-col items-center', className)}
      {...props}
    >
      <EmptyInbox {...iconProps} />
      <p className="text-slate-400">{children ?? t('nothing-found')}</p>
    </div>
  )
}
