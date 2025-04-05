import { type Dispatch, type SetStateAction, useCallback } from 'react'

import { useSelectedMonthStore } from '@/common/features/selected-month'
import { formatDate } from '@/common/lib/date'

import { useLocationState } from './use-location-state'

export type DatesParams = {
  from?: string
  to?: string
}

export interface UseDatesReturn extends DatesParams {
  onChange: Dispatch<SetStateAction<DatesParams>>
}

export interface UseDatesOptions {
  defaultFrom?: string
  defaultTo?: string
}
export const useDates = ({ defaultFrom, defaultTo }: UseDatesOptions = {}) => {
  const { startDate, endDate } = useSelectedMonthStore()

  const [from, setFrom] = useLocationState('from', defaultFrom ?? formatDate(startDate))
  const [to, setTo] = useLocationState('to', defaultTo ?? formatDate(endDate))

  const handleChange = useCallback(
    (values: DatesParams) => {
      if (values.from) {
        setFrom(values.from)
      }
      if (values.to) {
        setTo(values.to)
      }
    },
    [setFrom, setTo]
  )

  return {
    from,
    to,
    onChange: handleChange
  }
}
