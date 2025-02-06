import { useJurnal7DefaultsStore } from '@renderer/app/jurnal-7/common/features/defaults'
import { useDefaultFilters } from '@renderer/common/features/app-defaults'
import { useLocationState, usePagination } from '@renderer/common/hooks'
import { useForm } from 'react-hook-form'

export const useJurnal7DateRange = () => {
  const pagination = usePagination()
  const defaultFilters = useDefaultFilters()
  const jurnal7Default = useJurnal7DefaultsStore()

  const [from, setFrom] = useLocationState<string | undefined>(
    'from',
    jurnal7Default.from || defaultFilters.from
  )
  const [to, setTo] = useLocationState<string | undefined>(
    'to',
    jurnal7Default.to || defaultFilters.to
  )

  const form = useForm({
    defaultValues: {
      from,
      to
    }
  })

  const applyFilters = form.handleSubmit((values) => {
    pagination.onChange({
      page: 1
    })
    if (values.from) {
      setFrom(values.from)
    }
    if (values.to) {
      setTo(values.to)
    }
  })

  return {
    form,
    applyFilters,
    from,
    to
  }
}
