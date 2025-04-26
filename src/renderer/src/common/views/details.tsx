import { type HTMLAttributes } from 'react'

import { CircleCheck, Loader2 } from 'lucide-react'
import { Focusable } from 'react-aria-components'
import { useTranslation } from 'react-i18next'

import { LoadingOverlay } from '@/common/components'
import { Button, type ButtonProps } from '@/common/components/jolly/button'
import { cn } from '@/common/lib/utils'

export type DetailsViewProps = HTMLAttributes<HTMLElement>
export const DetailsView = ({ children, className, ...props }: DetailsViewProps) => {
  return (
    <div
      {...props}
      className={cn('flex-1 min-h-0 relative flex flex-col', className)}
    >
      {children}
    </div>
  )
}

export type DetailsViewContentProps = HTMLAttributes<HTMLElement> & {
  loading?: boolean
}
const DetailsViewContent = ({
  children,
  loading,
  className,
  ...props
}: DetailsViewContentProps) => {
  return loading ? (
    <LoadingOverlay {...props} />
  ) : (
    <div className={cn('flex-1 overflow-y-auto scrollbar', className)}>{children}</div>
  )
}

export type DetailsViewFooterProps = HTMLAttributes<HTMLElement>
const DetailsViewFooter = ({ children, className, ...props }: DetailsViewFooterProps) => {
  return (
    <div
      {...props}
      className={cn(
        'w-full fixed bottom-0 p-5 z-[100] border-t border-slate-200 bg-white',
        className
      )}
    >
      {children}
    </div>
  )
}

export interface DetailsViewCreateProps extends ButtonProps {
  isPending?: boolean
}
const DetailsViewCreate = ({ isPending = false, ...props }: DetailsViewCreateProps) => {
  const { t } = useTranslation()

  return (
    <Focusable>
      <Button
        isPending={isPending}
        type="submit"
        {...props}
      >
        {isPending ? (
          <Loader2 className="btn-icon icon-start icon-sm" />
        ) : (
          <CircleCheck className="btn-icon icon-start" />
        )}
        {t('save')}
      </Button>
    </Focusable>
  )
}

DetailsView.Footer = DetailsViewFooter
DetailsView.Content = DetailsViewContent
DetailsView.Create = DetailsViewCreate
