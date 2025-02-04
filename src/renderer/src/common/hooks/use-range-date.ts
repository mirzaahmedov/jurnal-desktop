import { type Dispatch, type SetStateAction, useEffect } from 'react'

import { useDefaultFilters } from '@/common/features/app-defaults'

import { createLocationStore, useLocationState } from './use-location-state'
import { usePagination } from './use-pagination'

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

  const { onChange } = usePagination()

  const from = params?.from ?? defaults.from
  const to = params?.to ?? defaults.to

  useEffect(() => {
    onChange({
      page: 1
    })
  }, [from, to, onChange])

  return {
    from,
    to,
    onChange: setParams
  }
}
