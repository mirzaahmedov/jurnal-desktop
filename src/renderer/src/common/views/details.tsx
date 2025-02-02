import type { ButtonHTMLAttributes, HTMLAttributes } from 'react'

import { LoadingSpinner } from '@renderer/common/components'
import { Button } from '@renderer/common/components/ui/button'
import { cn } from '@renderer/common/lib/utils'
import { CircleCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type DetailsViewProps = HTMLAttributes<HTMLElement>
const DetailsView = ({ children, className, ...props }: DetailsViewProps) => {
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
    <div
      {...props}
      className="h-full flex items-center justify-center"
    >
      <LoadingSpinner />
    </div>
  ) : (
    <div className={cn('flex-1 overflow-y-auto scrollbar', className)}>{children}</div>
  )
}

type DetailsViewFooterProps = HTMLAttributes<HTMLElement>
const DetailsViewFooter = ({ children, className, ...props }: DetailsViewFooterProps) => {
  return (
    <div
      {...props}
      className={cn('w-full fixed bottom-0 p-5 z-10 border-t border-slate-200 bg-white', className)}
    >
      {children}
    </div>
  )
}

type DetailsViewCreateProps = ButtonHTMLAttributes<HTMLButtonElement>
const DetailsViewCreate = (props: DetailsViewCreateProps) => {
  const { t } = useTranslation()
  return (
    <Button {...props}>
      <CircleCheck className="btn-icon icon-start" /> {t('save')}
    </Button>
  )
}

DetailsView.Footer = DetailsViewFooter
DetailsView.Content = DetailsViewContent
DetailsView.Create = DetailsViewCreate

export { DetailsView }
export type {
  DetailsViewProps,
  DetailsViewContentProps,
  DetailsViewFooterProps,
  DetailsViewCreateProps
}
