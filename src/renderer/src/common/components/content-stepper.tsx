import { type FC, useEffect, useState } from 'react'

import { ArrowUpRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

import { Button } from './jolly/button'
import { Input } from './ui/input'

export interface ContentStepperProps {
  itemsCount: number
  currentIndex: number
  onIndexChange: (index: number) => void
}
export const ContentStepper: FC<ContentStepperProps> = ({
  itemsCount,
  currentIndex,
  onIndexChange
}) => {
  const [value, setValue] = useState(currentIndex + 1)

  useEffect(() => {
    setValue(currentIndex + 1)
  }, [currentIndex])

  const handlePrev = () => {
    setValue((prev) => {
      const newValue = prev > 1 ? prev - 1 : 1
      onIndexChange(newValue - 1)
      return newValue
    })
  }

  const handleNext = () => {
    setValue((prev) => {
      const newValue = prev < itemsCount ? prev + 1 : itemsCount
      onIndexChange(newValue - 1)
      return newValue
    })
  }

  return (
    <div className="w-fit flex flex-row items-center gap-4 rounded-lg px-4 py-3">
      <Button
        onClick={handlePrev}
        variant="ghost"
        size="icon"
        isDisabled={value <= 1}
        aria-label="Previous"
        className="transition-colors"
      >
        <ChevronsLeft className="btn-icon" />
      </Button>
      <div className="flex items-center gap-2">
        <Input
          value={value || ''}
          min={1}
          max={itemsCount}
          onChange={(e) => {
            const valueNumber = Number(e.target.value)
            if (isNaN(valueNumber) || valueNumber === 0) {
              setValue(0)
              return
            }
            const newValue = Math.max(1, Math.min(itemsCount, valueNumber ?? 1))
            setValue(newValue)
          }}
          className="w-14 font-semibold border rounded focus:ring-2 focus:ring-blue-500"
          onBlur={(e) => {
            if (e.target.value === '' || Number(e.target.value) < 1) {
              setValue(1)
              onIndexChange(0)
            }
          }}
        />
        <span className="text-gray-500">/ {itemsCount}</span>
        <Button
          size="icon"
          aria-label="Go"
          className="ml-1"
          onClick={() => {
            if (value < 1 || value > itemsCount) {
              setValue(1)
              return
            }
            onIndexChange(value - 1)
          }}
        >
          <ArrowUpRight className="btn-icon" />
        </Button>
      </div>
      <Button
        onClick={handleNext}
        variant="ghost"
        size="icon"
        isDisabled={value >= itemsCount}
        aria-label="Next"
        className="transition-colors"
      >
        <ChevronsRight className="btn-icon" />
      </Button>
    </div>
  )
}
