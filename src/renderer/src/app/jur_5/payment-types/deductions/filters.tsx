import type { InputHTMLAttributes } from 'react'

import { useTranslation } from 'react-i18next'

import { Debouncer } from '@/common/components/hoc/debouncer'
import { Input } from '@/common/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { useLocationState } from '@/common/hooks'

export enum DeductionFilterTabOption {
  All = 'all',
  ChangePayment = 'change_payment'
}

export const useTabFilter = () => {
  return useLocationState('tabValue', DeductionFilterTabOption.All)
}
export const useNameFilter = () => {
  return useLocationState<string | undefined>('name', undefined)
}
export const useCodeFilter = () => {
  return useLocationState<string | undefined>('code', undefined)
}

export const DeductionFilter = () => {
  const { t } = useTranslation(['app'])

  const [tabValue, setTabValue] = useTabFilter()

  return (
    <Tabs
      value={tabValue}
      onValueChange={(value) => setTabValue(value as DeductionFilterTabOption)}
    >
      <TabsList>
        <TabsTrigger value={DeductionFilterTabOption.All}>{t('all')}</TabsTrigger>
        <TabsTrigger value={DeductionFilterTabOption.ChangePayment}>
          {t('change_payment')}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

type DeductionSpravochnikFilterProps = InputHTMLAttributes<HTMLInputElement> & {
  getValue: (key: string) => string | undefined
  setValue: (key: string, value: string) => void
}
export const DeductionSpravochnikFilter = ({
  getValue,
  setValue
}: DeductionSpravochnikFilterProps) => {
  const { t } = useTranslation(['app'])

  const name = getValue('name') || ''
  const code = getValue('code') || ''

  return (
    <div className="flex items-center justify-start gap-5">
      <Debouncer
        value={name}
        onChange={(value) => setValue('name', value)}
        delay={300}
      >
        {({ value, onChange }) => (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t('name')}
            className="w-64"
          />
        )}
      </Debouncer>
      <Debouncer
        value={code}
        onChange={(value) => setValue('code', value)}
        delay={300}
      >
        {({ value, onChange }) => (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t('code')}
            className="w-64"
          />
        )}
      </Debouncer>
    </div>
  )
}
