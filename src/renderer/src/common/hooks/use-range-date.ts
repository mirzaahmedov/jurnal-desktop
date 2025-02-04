import type { Dispatch, SetStateAction } from 'react'

import { useState } from 'react'

import { useDefaultFilters } from '@/common/features/app-defaults'

export interface RangeDateParams {
  from?: string
  to?: string
}
export interface UseRangeDateReturn extends RangeDateParams {
  onChange: Dispatch<SetStateAction<RangeDateParams>>
}
const useRangeDate = () => {
  const [params, setParams] = useState<{
    from?: string
    to?: string
  }>({})

  const defaults = useDefaultFilters()

  const from = params.from ?? defaults.from
  const to = params.to ?? defaults.to

  return {
    from,
    to,
    onChange: setParams
  }
}

export { useRangeDate }
