import type { HTMLAttributes, SVGAttributes } from 'react'

import { useTranslation } from 'react-i18next'

import { EmptyFolder } from '@/common/assets/illustrations/empty-folder'
import { cn } from '@/common/lib/utils'

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
      <EmptyFolder {...iconProps} />
      <p className="text-slate-400 text-sm">{children ?? t('nothing-found')}</p>
    </div>
  )
}
