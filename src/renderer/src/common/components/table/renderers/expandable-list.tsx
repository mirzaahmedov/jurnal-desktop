import type { ReactNode } from 'react'

import { ArrowDownLeft } from 'lucide-react'
import { Trans } from 'react-i18next'

import { DataList } from '@/common/components/data-list'
import { Button } from '@/common/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover'

export interface ExpandableListProps<T> {
  items: T[]
  renderHeader?: () => ReactNode
  renderItem: (item: T) => ReactNode
}
export const ExpandableList = <T,>({ items, renderHeader, renderItem }: ExpandableListProps<T>) => {
  if (!Array.isArray(items) || items.length === 0) {
    return null
  }
  return (
    <div className="flex flex-col items-end">
      <div className="w-full">
        <DataList
          className="text-sm"
          renderHeader={renderHeader}
          items={items.slice(0, 2).map((item, index) => ({
            name: index + 1,
            value: renderItem(item)
          }))}
        />
      </div>
      {items.length > 2 ? (
        <Popover>
          <div className="w-full">
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
          </div>
          <PopoverContent align="end">
            <DataList
              renderHeader={renderHeader}
              items={items.map((item, index) => ({
                name: index + 1,
                value: renderItem(item)
              }))}
            />
          </PopoverContent>
        </Popover>
      ) : null}
    </div>
  )
}
