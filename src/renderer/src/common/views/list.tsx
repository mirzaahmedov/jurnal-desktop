import { type HTMLAttributes, forwardRef, useState } from 'react'

import { LoadingOverlay } from '@renderer/common/components'
import { Pagination } from '@renderer/common/components/pagination'
import { RangeDatePicker } from '@renderer/common/components/range-date-picker'
import { Maximize, Minimize } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/common/components/ui/button'
import { cn } from '@/common/lib/utils'

type ListViewProps = HTMLAttributes<HTMLDivElement>
export const ListView = ({ children, className, ...props }: ListViewProps) => {
  const [maximized, setMaximized] = useState(false)

  const { t } = useTranslation()

  return (
    <div
      {...props}
      className={cn(
        'flex-1 relative min-h-0 flex flex-col',
        maximized && 'fixed top-0 left-0 bottom-0 right-0 z-[100] bg-white',
        className
      )}
    >
      <Button
        variant="outline"
        className="absolute bottom-5 right-5 z-50"
        onClick={() => setMaximized((prev) => !prev)}
      >
        {maximized ? (
          <>
            <Minimize className="btn-icon" />
            <span>{t('minimize')}</span>
          </>
        ) : (
          <>
            <Maximize className="btn-icon" />
            <span>{t('maximize')}</span>
          </>
        )}
      </Button>
      {children}
    </div>
  )
}

const ListViewHeader = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('p-5 flex items-center flex-wrap', className)}
      {...props}
    >
      {children}
    </div>
  )
}

type ListViewContentProps = HTMLAttributes<HTMLDivElement> & {
  loading: boolean
}
const ListViewContent = forwardRef<HTMLDivElement, ListViewContentProps>(
  ({ loading, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex-1 relative overflow-auto scrollbar', className)}
        {...props}
      >
        {loading ? <LoadingOverlay /> : null}
        {children}
      </div>
    )
  }
)

const ListViewFooter = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('p-5', className)}
      {...props}
    >
      {children}
    </div>
  )
}

ListView.Header = ListViewHeader
ListView.RangeDatePicker = RangeDatePicker
ListView.Content = ListViewContent
ListView.Pagination = Pagination
ListView.Footer = ListViewFooter
