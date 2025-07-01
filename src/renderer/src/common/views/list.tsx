import { type HTMLAttributes, forwardRef } from 'react'

import { LoadingOverlay } from '@/common/components'
import { Pagination } from '@/common/components/pagination'
import { RangeDatePicker } from '@/common/components/range-date-picker'
import { cn } from '@/common/lib/utils'

export interface ListViewProps extends HTMLAttributes<HTMLDivElement> {}
export const ListView = ({ children, className, ...props }: ListViewProps) => {
  return (
    <div
      {...props}
      className={cn('flex-1 relative min-h-0 flex flex-col', className)}
    >
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
  isLoading: boolean
}
const ListViewContent = forwardRef<HTMLDivElement, ListViewContentProps>(
  ({ isLoading, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex-1 relative overflow-auto scrollbar', className)}
        {...props}
      >
        {isLoading ? <LoadingOverlay /> : null}
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
