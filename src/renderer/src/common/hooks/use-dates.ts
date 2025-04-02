import { type Dispatch, type SetStateAction, useCallback } from 'react'

import { useSettingsStore } from '@/common/features/settings'

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
  const { default_start_date, default_end_date } = useSettingsStore()

  const [from, setFrom] = useLocationState('from', defaultFrom ?? default_start_date)
  const [to, setTo] = useLocationState('to', defaultTo ?? default_end_date)

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
