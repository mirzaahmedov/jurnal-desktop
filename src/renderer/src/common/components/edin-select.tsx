import { SelectField, SelectFieldProps } from './select-field'
import { unitQueryKeys, unitService } from '@renderer/app/super-admin/unit'

import { Unit } from '@/common/models'
import { useQuery } from '@tanstack/react-query'

const EdinSelect = (props: Partial<SelectFieldProps<Unit>>) => {
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
      {...props}
    />
  )
}

export { EdinSelect }
