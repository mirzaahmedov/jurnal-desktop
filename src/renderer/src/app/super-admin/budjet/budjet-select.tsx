import type { Budjet } from '@/common/models'

import { useEffect, useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { JollySelect, type JollySelectProps, SelectItem } from '@/common/components/jolly/select'

import { BudjetQueryKeys } from './config'
import { BudgetService } from './service'

export interface BudjetSelectProps extends Omit<JollySelectProps<Budjet>, 'children'> {
  withOptionAll?: boolean
  withFirstOptionSelected?: boolean
}
export const BudjetSelect = ({
  withOptionAll = false,
  withFirstOptionSelected,
  ...props
}: BudjetSelectProps) => {
  const { t } = useTranslation()
  const { data: budjets, isFetching } = useQuery({
    queryKey: [BudjetQueryKeys.getAll],
    queryFn: BudgetService.getAll
  })

  const options = useMemo(() => {
    const budjetOptions = budjets?.data ?? []
    if (withOptionAll && budjetOptions.length > 0) {
      return [
        {
          id: 0,
          name: t('all')
        },
        ...budjetOptions
      ]
    }
    return budjetOptions
  }, [budjets, withOptionAll])

  useEffect(() => {
    if (withFirstOptionSelected && options.length > 0) {
      props.onSelectionChange?.(options[0].id)
    }
  }, [withFirstOptionSelected, options])

  return (
    <JollySelect
      placeholder={t('budjet')}
      items={options}
      isDisabled={isFetching}
      {...props}
    >
      {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
    </JollySelect>
  )
}

{
  /* <SelectField
  value={value ? String(value) : ''}
  onValueChange={(value) => {
    onValueChange?.(Number(value))
  }}
  disabled={isFetching}
  options={options}
  getOptionLabel={(option) => option.name}
  getOptionValue={(option) => option.id}
  
  {...props}
/> */
}
