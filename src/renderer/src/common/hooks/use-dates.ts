import { type Dispatch, type SetStateAction, useCallback } from 'react'

import { useDefaultFilters } from '@/common/features/app-defaults'

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
  const defaults = useDefaultFilters()

  const [from, setFrom] = useLocationState('from', defaultFrom ?? defaults.from)
  const [to, setTo] = useLocationState('to', defaultTo ?? defaults.to)

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
