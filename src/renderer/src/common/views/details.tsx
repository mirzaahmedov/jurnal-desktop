import type { ButtonHTMLAttributes, HTMLAttributes } from 'react'

import { cn } from '@/common/lib/utils'
import { CircleCheck } from 'lucide-react'
import { Button } from '@/common/components/ui/button'
import { LoadingSpinner } from '@/common/components'
import { ScrollArea } from '@/common/components/ui/scroll-area'

type DetailsViewProps = HTMLAttributes<HTMLElement>
const DetailsView = ({ children, className, ...props }: DetailsViewProps) => {
  return (
    <div {...props} className={cn('flex-1 min-h-0 relative flex flex-col', className)}>
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
    <div {...props} className="h-full flex items-center justify-center">
      <LoadingSpinner />
    </div>
  ) : (
    <ScrollArea className={cn('flex-1', className)}>{children}</ScrollArea>
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
  return (
    <Button {...props}>
      <CircleCheck className="btn-icon icon-start" /> Сохранить
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
