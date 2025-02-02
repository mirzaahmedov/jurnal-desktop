import { parseAsString, useQueryStates } from 'nuqs'
import { useForm } from 'react-hook-form'

import { usePagination } from '@/common/components'
import { useDefaultFilters } from '@/common/features/app-defaults'

export const useDateRange = () => {
  const { setCurrentPage } = usePagination()
  const [params, setParams] = useQueryStates({
    from: parseAsString,
    to: parseAsString
  })

  const defaultFilters = useDefaultFilters()

  const from = params.from ?? defaultFilters.from
  const to = params.to ?? defaultFilters.to

  const form = useForm({
    defaultValues: {
      from,
      to
    }
  })

  const applyFilters = form.handleSubmit(({ from, to }) => {
    setCurrentPage(1)
    setParams({
      from,
      to
    })
  })

  return {
    form,
    applyFilters,
    setParams,
    from,
    to
  }
}
