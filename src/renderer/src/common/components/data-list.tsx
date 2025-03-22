import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/common/lib/utils'

export interface DataListItem {
  name: ReactNode
  value: ReactNode
}

export interface DataListProps extends HTMLAttributes<HTMLUListElement> {
  list: DataListItem[]
}
export const DataList = ({ list, className, ...props }: DataListProps) => {
  return (
    <ul
      className={cn('flex flex-col gap-2 text-foreground', className)}
      {...props}
    >
      {list.map((item, index) => (
        <DataListItem
          key={index}
          item={item}
        />
      ))}
    </ul>
  )
}

export const DataListItem = ({ item }: { item: DataListItem }) => {
  return (
    <li className="flex items-start gap-2 justify-between text-sm">
      <span className="text-xs">{item.name}</span>
      <span className="flex-1 border-b border-slate-200 border-dotted h-5"></span>
      <b className="break-words text-end">{item.value}</b>
    </li>
  )
}
