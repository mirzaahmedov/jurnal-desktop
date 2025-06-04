import type { Unit } from '@/common/models'

import { useQuery } from '@tanstack/react-query'

import { UnitQueryKeys, UnitService } from '@/app/super-admin/unit'

import { JollySelect, type JollySelectProps, SelectItem } from './jolly/select'

export interface EdinSelectProps extends Omit<JollySelectProps<Unit>, 'children'> {
  tabIndex?: number
  error: boolean
}
export const EdinSelect = ({ error, ...props }: EdinSelectProps) => {
  const { data: edins, isFetching } = useQuery({
    queryKey: [UnitQueryKeys.getAll],
    queryFn: UnitService.getAll
  })

  return (
    <JollySelect
      {...props}
      isDisabled={isFetching}
      isInvalid={error}
      items={edins?.data ?? []}
      className="[&>button]:border-none [&>button]:bg-transparent"
    >
      {(unit: Unit) => <SelectItem id={unit.id}>{unit.name}</SelectItem>}
    </JollySelect>
  )
}
