import { type HTMLAttributes, forwardRef, useState } from 'react'

import { Maximize, Minimize } from 'lucide-react'

import { LoadingOverlay } from '@/common/components'
import { Pagination } from '@/common/components/pagination'
import { RangeDatePicker } from '@/common/components/range-date-picker'
import { Button } from '@/common/components/ui/button'
import { cn } from '@/common/lib/utils'

export interface ListViewProps extends HTMLAttributes<HTMLDivElement> {}
export const ListView = ({ children, className, ...props }: ListViewProps) => {
  const [maximized, setMaximized] = useState(false)

  return (
    <div
      {...props}
      className={cn(
        'flex-1 relative min-h-0 flex flex-col',
        maximized && 'fixed top-0 left-0 bottom-0 right-0 z-100 bg-white',
        className
      )}
    >
      <Button
        size="icon"
        variant="outline"
        className="fixed bottom-5 right-16 z-100"
        onClick={() => setMaximized((prev) => !prev)}
      >
        {maximized ? <Minimize className="btn-icon" /> : <Maximize className="btn-icon" />}
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

export interface ListViewContentProps extends HTMLAttributes<HTMLDivElement> {
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

export interface ListViewFooterProps extends HTMLAttributes<HTMLDivElement> {}
const ListViewFooter = ({ children, className, ...props }: ListViewFooterProps) => {
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
