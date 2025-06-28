import type { Unit } from '@/common/models'

import { useQuery } from '@tanstack/react-query'

import { UnitQueryKeys, UnitService } from '@/app/super-admin/unit'
import { cn } from '@/common/lib/utils'

import { ComboboxItem, JollyComboBox, type JollyComboBoxProps } from './jolly/combobox'

export interface EdinSelectProps extends Omit<JollyComboBoxProps<Unit>, 'children'> {
  error: boolean
}
export const EdinSelect = ({ error, ...props }: EdinSelectProps) => {
  const { data: edins, isFetching } = useQuery({
    queryKey: [UnitQueryKeys.getAll],
    queryFn: UnitService.getAll
  })

  const options = edins?.data ?? []

  return (
    <JollyComboBox
      {...props}
      allowsEmptyCollection
      isDisabled={isFetching}
      isInvalid={error}
      defaultItems={options}
      className={cn(
        'm-0.5 gap-0 [&>div]:border-none [&>div]:bg-transparent [&>div]:rounded-none [&_input]:bg-transparent',
        error && 'bg-red-50 ring-2 ring-red-500'
      )}
      menuTrigger="focus"
      popoverProps={{
        className: 'w-max max-w-sm'
      }}
    >
      {(option: Unit) => <ComboboxItem id={option.id}>{option.name}</ComboboxItem>}
    </JollyComboBox>
  )
}
