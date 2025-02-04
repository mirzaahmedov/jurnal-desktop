import { parseAsString, useQueryStates } from 'nuqs'
import { useForm } from 'react-hook-form'

import { useDefaultFilters } from '@/common/features/app-defaults'
import { usePagination } from '@/common/hooks/use-pagination'

export const useDateRange = () => {
  const [params, setParams] = useQueryStates({
    from: parseAsString,
    to: parseAsString
  })

  const pagination = usePagination()
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
    pagination.onChange({
      page: 1
    })
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
