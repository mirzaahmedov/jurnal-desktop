import { parseAsString, useQueryStates } from 'nuqs'
import { useDefaultFilters } from '@/common/features/app-defaults'

const useRangeDate = () => {
  const [params, setParams] = useQueryStates({
    from: parseAsString,
    to: parseAsString
  })

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
