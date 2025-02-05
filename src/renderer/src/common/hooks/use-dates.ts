import { type Dispatch, type SetStateAction } from 'react'

import { useDefaultFilters } from '@/common/features/app-defaults'

import { createLocationStore, useLocationState } from './use-location-state'

export type DatesParams = {
  from?: string
  to?: string
}

const useDatesStore = createLocationStore<DatesParams>('dates')

export interface UseRangeDateReturn extends DatesParams {
  onChange: Dispatch<SetStateAction<DatesParams>>
}
export const useDates = () => {
  const datesStore = useDatesStore()
  const defaults = useDefaultFilters()

  const [params, setParams] = useLocationState<DatesParams>(datesStore)

  const from = params?.from ?? defaults.from
  const to = params?.to ?? defaults.to

  return {
    from,
    to,
    onChange: setParams
  }
}
