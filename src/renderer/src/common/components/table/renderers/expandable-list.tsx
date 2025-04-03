import { ArrowDownLeft } from 'lucide-react'
import { Trans } from 'react-i18next'

import { DataList } from '../../data-list'
import { Button } from '../../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'

export interface ExpandableListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}
export const ExpandableList = <T,>({ items, renderItem }: ExpandableListProps<T>) => {
  if (!Array.isArray(items) || items.length === 0) {
    return null
  }
  return (
    <div className="flex flex-col items-end">
      <div className="w-full">
        <DataList
          className="text-sm"
          list={items.slice(0, 2).map((item, index) => ({
            name: index + 1,
            value: renderItem(item)
          }))}
        />
      </div>
      {items.length > 2 ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="link"
              className="p-0 text-xs text-brand gap-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <ArrowDownLeft className="size-4" />
              <Trans>view_all</Trans>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end">
            <DataList
              list={items.map((item, index) => ({
                name: index + 1,
                // Use the renderItem function to render the item
                value: renderItem(item)
              }))}
            />
          </PopoverContent>
        </Popover>
      ) : null}
    </div>
  )
}
