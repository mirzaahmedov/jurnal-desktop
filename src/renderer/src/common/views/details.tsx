import { type HTMLAttributes, useEffect, useRef } from 'react'

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
      className={cn('flex-1 min-h-0 flex flex-col', className)}
    >
      {children}
    </div>
  )
}

export type DetailsViewContentProps = HTMLAttributes<HTMLElement> & {
  isLoading?: boolean
}
const DetailsViewContent = ({
  children,
  isLoading,
  className,
  ...props
}: DetailsViewContentProps) => {
  return isLoading ? (
    <LoadingOverlay {...props} />
  ) : (
    <div className={cn('flex-1 relative overflow-y-auto scrollbar', className)}>{children}</div>
  )
}

export type DetailsViewFooterProps = HTMLAttributes<HTMLElement>
const DetailsViewFooter = ({ children, className, ...props }: DetailsViewFooterProps) => {
  return (
    <div
      {...props}
      className={cn(
        'w-full fixed bottom-[37px] z-100 p-5 border-t border-slate-200 bg-white',
        className
      )}
    >
      {children}
    </div>
  )
}

export interface DetailsViewCreateProps extends ButtonProps {
  isPending?: boolean
  tabIndex?: number
}
const DetailsViewCreate = ({ isPending = false, tabIndex, ...props }: DetailsViewCreateProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const { t } = useTranslation()

  useEffect(() => {
    buttonRef.current?.setAttribute('tabindex', String(tabIndex))
  }, [tabIndex])

  return (
    <Focusable>
      <Button
        isPending={isPending}
        type="submit"
        {...props}
        ref={buttonRef}
      >
        {t('save')}
      </Button>
    </Focusable>
  )
}

DetailsView.Footer = DetailsViewFooter
DetailsView.Content = DetailsViewContent
DetailsView.Create = DetailsViewCreate
