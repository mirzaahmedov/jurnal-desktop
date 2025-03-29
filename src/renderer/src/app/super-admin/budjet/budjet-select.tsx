import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { SelectField, type SelectFieldProps } from '@/common/components'

import { budjetQueryKeys } from './constants'
import { BudgetService } from './service'

export interface BudjetSelectProps
  extends Omit<
    SelectFieldProps<number>,
    'options' | 'value' | 'onValueChange' | 'getOptionValue' | 'getOptionLabel'
  > {
  value?: number
  onValueChange?: (value: number) => void
  withOptionAll?: boolean
}
export const BudjetSelect = ({
  value,
  onValueChange,
  withOptionAll = false,
  ...props
}: BudjetSelectProps) => {
  const { t } = useTranslation()
  const { data: budjets, isFetching } = useQuery({
    queryKey: [budjetQueryKeys.getAll],
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

  return (
    <SelectField
      value={value ? String(value) : undefined}
      onValueChange={(value) => {
        onValueChange?.(Number(value))
      }}
      disabled={isFetching}
      options={options}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.id}
      placeholder={t('budjet')}
      {...props}
    />
  )
}
