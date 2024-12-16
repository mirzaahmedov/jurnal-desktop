import type { HTMLAttributes, PropsWithChildren } from 'react'

import { RangeDatePicker } from '@/common/components/range-date-picker'
import { Pagination } from '@/common/components/pagination-alt'
import { ScrollArea } from '@/common/components/ui/scroll-area'
import { LoadingOverlay } from '@/common/components'
import { cn } from '@/common/lib/utils'

type ListViewProps = HTMLAttributes<HTMLDivElement>
const ListView = ({ children, className, ...props }: ListViewProps) => {
  return (
    <div {...props} className={cn('flex-1 min-h-0 flex flex-col', className)}>
      {children}
    </div>
  )
}

const ListViewHeader = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  )
}

type ListViewContentProps = PropsWithChildren<{
  loading: boolean
}>
const ListViewContent = ({ loading, children }: ListViewContentProps) => {
  return (
    <ScrollArea className="flex-1 relative">
      {loading ? <LoadingOverlay /> : null}
      {children}
    </ScrollArea>
  )
}

const ListViewFooter = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('p-5', className)} {...props}>
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
