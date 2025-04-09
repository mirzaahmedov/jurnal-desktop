import type { MainSchet } from '@/common/models'

import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { SelectField, type SelectFieldProps } from '@/common/components'

import { MainSchetQueryKeys } from './config'
import { MainSchetService } from './service'

export interface MainSchetSelectProps
  extends Omit<
    SelectFieldProps<MainSchet>,
    'options' | 'value' | 'onValueChange' | 'getOptionValue' | 'getOptionLabel'
  > {
  budjet_id?: number
  value?: number
  onValueChange?: (value: number) => void
  withOptionAll?: boolean
}
export const MainSchetSelect = ({
  budjet_id,
  value,
  onValueChange,
  withOptionAll = false,
  ...props
}: MainSchetSelectProps) => {
  const { t } = useTranslation()
  const { data: mainSchets, isFetching } = useQuery({
    queryKey: [
      MainSchetQueryKeys.getAll,
      {
        budjet_id
      }
    ],
    queryFn: MainSchetService.getAll
  })

  const options = useMemo(() => {
    const mainSchetOptions = mainSchets?.data ?? []
    if (withOptionAll && mainSchetOptions.length > 0) {
      return [
        {
          id: 0,
          account_number: t('all')
        } as MainSchet,
        ...mainSchetOptions
      ]
    }
    return mainSchetOptions
  }, [mainSchets, withOptionAll])

  return (
    <SelectField
      value={value ? String(value) : ''}
      onValueChange={(value) => {
        onValueChange?.(Number(value))
      }}
      disabled={isFetching}
      options={options}
      getOptionLabel={(option) => option.account_number}
      getOptionValue={(option) => option.id}
      placeholder={t('main-schet')}
      {...props}
    />
  )
}
