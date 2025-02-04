import { useState } from 'react'

import { useDefaultFilters } from '@/common/features/app-defaults'

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
