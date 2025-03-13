import type { SelectFieldProps } from './select-field'
import type { Unit } from '@/common/models'

import { unitQueryKeys, unitService } from '@renderer/app/super-admin/unit'
import { useQuery } from '@tanstack/react-query'

import { SelectField } from './select-field'

export interface EdinSelectProps extends Partial<SelectFieldProps<Unit>> {
  error: boolean
}
export const EdinSelect = ({ error, ...props }: EdinSelectProps) => {
  const { data: unitList, isFetching } = useQuery({
    queryKey: [unitQueryKeys.getAll],
    queryFn: unitService.getAll
  })

  const options = unitList?.data ?? []

  return (
    <SelectField
      disabled={isFetching || !Array.isArray(options) || !options.length}
      placeholder=""
      options={options}
      getOptionValue={(option) => option.name}
      getOptionLabel={(option) => option.name}
      data-error={error}
      {...props}
      onValueChange={(value) => {
        if (isFetching || options.length === 0) {
          return
        }
        props.onValueChange?.(value)
      }}
    />
  )
}
