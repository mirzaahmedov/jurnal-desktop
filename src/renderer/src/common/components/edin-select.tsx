import type { Unit } from '@/common/models'

import { useQuery } from '@tanstack/react-query'
import { ChevronsUpDown } from 'lucide-react'

import { UnitQueryKeys, UnitService } from '@/app/super-admin/unit'

import { Button } from './jolly/button'
import {
  Combobox,
  ComboboxInput,
  ComboboxItem,
  ComboboxListBox,
  ComboboxPopover,
  type JollyComboBoxProps
} from './jolly/combobox'
import { FieldGroup } from './jolly/field'

export interface EdinSelectProps extends Omit<JollyComboBoxProps<Unit>, 'children'> {
  tabIndex?: number
  error: boolean
}
export const EdinSelect = ({ error, tabIndex, ...props }: EdinSelectProps) => {
  const { data: edins, isFetching } = useQuery({
    queryKey: [UnitQueryKeys.getAll],
    queryFn: UnitService.getAll
  })

  return (
    <Combobox
      allowsCustomValue
      formValue="text"
      isDisabled={isFetching}
      items={edins?.data ?? []}
      {...props}
    >
      <FieldGroup
        data-error={error}
        className="border-none rounded-none hover:ring-0 bg-transparent py-0 mt-0.5 mb-px data-[error=true]:bg-destructive/10 data-[error=true]:!ring-2 data-[error=true]:!ring-offset-0 data-[error=true]:!ring-solid data-[error=true]:!ring-destructive"
      >
        <ComboboxInput
          className="bg-transparent"
          tabIndex={tabIndex}
        />
        <Button
          variant="ghost"
          size="icon"
          className="mr-1 size-6 p-1"
        >
          <ChevronsUpDown
            aria-hidden="true"
            className="size-4 opacity-50"
          />
        </Button>
      </FieldGroup>

      <ComboboxPopover
        placement="top"
        className="w-full max-w-xs"
      >
        <ComboboxListBox>
          {(item: Unit) => <ComboboxItem id={item.name}>{item.name}</ComboboxItem>}
        </ComboboxListBox>
      </ComboboxPopover>
    </Combobox>
  )
}
