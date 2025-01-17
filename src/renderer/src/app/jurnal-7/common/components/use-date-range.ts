import { parseAsString, useQueryStates } from 'nuqs'

import { useDefaultFilters } from '@renderer/common/features/app-defaults'
import { useForm } from 'react-hook-form'
import { useJurnal7DefaultsStore } from '@renderer/app/jurnal-7/common/features/defaults'
import { usePagination } from '@renderer/common/components'

export const useJurnal7DateRange = () => {
  const { setCurrentPage } = usePagination()
  const [params, setParams] = useQueryStates({
    from: parseAsString,
    to: parseAsString
  })

  const defaultFilters = useDefaultFilters()
  const jurnal7Default = useJurnal7DefaultsStore()

  const from = params.from || jurnal7Default.from || defaultFilters.from
  const to = params.to || jurnal7Default.to || defaultFilters.to

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
