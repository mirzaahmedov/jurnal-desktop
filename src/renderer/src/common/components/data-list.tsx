import type { ReactNode } from 'react'

export interface DataListItem {
  name: ReactNode
  value: ReactNode
}

export interface DataListProps {
  items: DataListItem[]
}
export const DataList = ({ items }: DataListProps) => {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, index) => (
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
    <li className="flex items-center gap-2 justify-between">
      <span className="text-sm">{item.name}</span>
      <span className="flex-1 border-b border-slate-200 border-dotted h-5"></span>
      <b>{item.value}</b>
    </li>
  )
}
