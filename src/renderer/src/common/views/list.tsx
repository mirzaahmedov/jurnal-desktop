import type { HTMLAttributes } from 'react'

import { LoadingOverlay } from '@/common/components'
import { Pagination } from '@/common/components/pagination-alt'
import { RangeDatePicker } from '@/common/components/range-date-picker'
import { cn } from '@/common/lib/utils'

type ListViewProps = HTMLAttributes<HTMLDivElement>
const ListView = ({ children, className, ...props }: ListViewProps) => {
  return (
    <div
      {...props}
      className={cn('flex-1 min-h-0 flex flex-col', className)}
    >
      {children}
    </div>
  )
}

const ListViewHeader = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('p-5', className)}
      {...props}
    >
      {children}
    </div>
  )
}

type ListViewContentProps = HTMLAttributes<HTMLDivElement> & {
  loading: boolean
}
const ListViewContent = ({ loading, children, className, ...props }: ListViewContentProps) => {
  return (
    <div
      className={cn('flex-1 relative overflow-auto scrollbar', className)}
      {...props}
    >
      {loading ? <LoadingOverlay /> : null}
      {children}
    </div>
  )
}

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

export { ListView }
