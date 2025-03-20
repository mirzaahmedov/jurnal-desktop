import type { ButtonHTMLAttributes, HTMLAttributes } from 'react'

import { LoadingOverlay, Spinner } from '@renderer/common/components'
import { Button } from '@renderer/common/components/ui/button'
import { cn } from '@renderer/common/lib/utils'
import { CircleCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type DetailsViewProps = HTMLAttributes<HTMLElement>
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

type DetailsViewContentProps = HTMLAttributes<HTMLElement> & {
  loading: boolean
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

type DetailsViewFooterProps = HTMLAttributes<HTMLElement>
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

export interface DetailsViewCreateProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}
const DetailsViewCreate = ({ loading = false, disabled, ...props }: DetailsViewCreateProps) => {
  const { t } = useTranslation()
  return (
    <Button
      {...props}
      disabled={loading || disabled}
    >
      {loading ? (
        <Spinner className="size-4 border-2 border-current border-r-transparent mr-2" />
      ) : (
        <CircleCheck className="btn-icon icon-start" />
      )}
      {t('save')}
    </Button>
  )
}

DetailsView.Footer = DetailsViewFooter
DetailsView.Content = DetailsViewContent
DetailsView.Create = DetailsViewCreate

export type { DetailsViewProps, DetailsViewContentProps, DetailsViewFooterProps }
