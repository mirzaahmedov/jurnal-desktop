import type { Schet } from '@/common/models'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/common/components/ui/button'

export interface SchetSelectorProps {
  value: number
  onValueChange: (value: number) => void
  schetOptions: Schet[]
}
export const SchetSelector = ({ value, onValueChange, schetOptions }: SchetSelectorProps) => {
  const currentIndex = schetOptions?.findIndex((schet) => schet.id === value)
  const nextIndex = currentIndex !== undefined ? (currentIndex + 1) % schetOptions.length : -1
  const prevIndex =
    currentIndex !== undefined ? (currentIndex - 1 + schetOptions.length) % schetOptions.length : -1

  return value && schetOptions?.length ? (
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant="outline"
        className="size-6"
        disabled={schetOptions?.length < 2}
        onClick={(e) => {
          e.stopPropagation()
          onValueChange(schetOptions[prevIndex].id)
        }}
      >
        <ChevronLeft className="btn-icon" />
      </Button>
      <span className="text-sm font-semibold">
        {schetOptions.find((schet) => schet.id === value)?.schet}
      </span>
      <Button
        size="icon"
        variant="outline"
        className="size-6"
        disabled={schetOptions?.length < 2}
        onClick={(e) => {
          e.stopPropagation()
          onValueChange(schetOptions[nextIndex].id)
        }}
      >
        <ChevronRight className="btn-icon" />
      </Button>
    </div>
  ) : null
}
