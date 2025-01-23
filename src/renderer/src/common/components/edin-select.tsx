import { SelectField, SelectFieldProps } from './select-field'
import { unitQueryKeys, unitService } from '@renderer/app/super-admin/unit'

import { Unit } from '@/common/models'
import { useQuery } from '@tanstack/react-query'

type EdinSelectProps = Partial<SelectFieldProps<Unit>> & {
  error: boolean
}
const EdinSelect = ({ error, ...props }: EdinSelectProps) => {
  const { data: unitList, isFetching } = useQuery({
    queryKey: [unitQueryKeys.getAll],
    queryFn: unitService.getAll
  })

  return (
    <SelectField
      disabled={isFetching}
      placeholder=""
      options={unitList?.data ?? []}
      getOptionValue={(option) => option.name}
      getOptionLabel={(option) => option.name}
      data-error={error}
      {...props}
    />
  )
}

export { EdinSelect }
