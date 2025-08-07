import { useEffect } from 'react'

import { ChevronsDown, ChevronsUp } from 'lucide-react'
import { Trans } from 'react-i18next'

import { Button } from '@/common/components/jolly/button'
import { formatNumber } from '@/common/lib/format'
import { cn } from '@/common/lib/utils'

import { generateColors } from './colors'

export const AdminDashboardRegionsList = <
  T extends {
    id: number
    name: string
    summa: number
  }
>({
  items,
  isMaximized,
  setMaximized,
  onToggleMaximized,
  onSelect
}: {
  items: T[]
  isMaximized: boolean
  setMaximized: (value: boolean) => void
  onToggleMaximized: VoidFunction
  onSelect?: (item: T) => void
}) => {
  const colors = generateColors(items.length)
  const isMaximizable = items.length > 4

  useEffect(() => {
    if (!isMaximizable) {
      setMaximized(false)
    }
  }, [isMaximizable])

  return (
    <div className="flex-1 overflow-hidden relative">
      <div
        className={cn(
          'absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-transparent to-white pointer-events-none',
          (isMaximized || !isMaximizable) && 'hidden'
        )}
      ></div>
      <ul>
        {items.map((item, index) => (
          <li
            key={item.id}
            className="text-sm flex items-center gap-2.5 px-2.5 py-1.5 hover:bg-gray-100 duration-200 rounded-lg cursor-pointer"
            onClick={() => onSelect?.(item)}
          >
            <span
              className="block size-4 rounded-full"
              style={{
                backgroundColor: colors[index]
              }}
            ></span>
            <span className="text-xs flex-1 font-medium">{item.name}</span>
            <b>{formatNumber(item.summa)}</b>
          </li>
        ))}
      </ul>
      {isMaximizable ? (
        <div className={cn('absolute bottom-0 left-0 px-2.5', isMaximized && 'static')}>
          <Button
            variant="link"
            className="p-0 text-xs text-brand gap-0.5 focus-visible:!ring-0"
            onClick={onToggleMaximized}
          >
            {isMaximized ? <ChevronsUp className="size-4" /> : <ChevronsDown className="size-4" />}
            <Trans>{isMaximized ? 'view_less' : 'view_all'}</Trans>
          </Button>
        </div>
      ) : null}
    </div>
  )
}
