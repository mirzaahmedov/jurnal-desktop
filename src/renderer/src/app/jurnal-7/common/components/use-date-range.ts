import { useJurnal7DefaultsStore } from '@renderer/app/jurnal-7/common/features/defaults'
import { useDefaultFilters } from '@renderer/common/features/app-defaults'
import { usePagination } from '@renderer/common/hooks'
import { parseAsString, useQueryStates } from 'nuqs'
import { useForm } from 'react-hook-form'

export const useJurnal7DateRange = () => {
  const [params, setParams] = useQueryStates({
    from: parseAsString,
    to: parseAsString
  })

  const pagination = usePagination()
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
