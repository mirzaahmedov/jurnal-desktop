import type { HTMLAttributes } from 'react'

import { cn } from '@renderer/common/lib/utils'

import { Spinner } from './loading'

export const LoadingOverlay = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={cn(
        'absolute top-0 bottom-0 left-0 right-0 z-50 bg-white/70 flex items-center justify-center',
        className
      )}
    >
      <Spinner />
    </div>
  )
}
