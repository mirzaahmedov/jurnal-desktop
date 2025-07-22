import { useTranslation } from 'react-i18next'

import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { useLocationState } from '@/common/hooks'

export enum PaymentFilterTabOption {
  All = 'all',
  ChangePayment = 'change_payment'
}

export const PaymentFilter = () => {
  const { t } = useTranslation(['app'])

  const [tabValue, setTabValue] = useLocationState('tab', PaymentFilterTabOption.All)

  return (
    <Tabs
      value={tabValue}
      onValueChange={(value) => setTabValue(value as PaymentFilterTabOption)}
    >
      <TabsList>
        <TabsTrigger value={PaymentFilterTabOption.All}>{t('all')}</TabsTrigger>
        <TabsTrigger value={PaymentFilterTabOption.ChangePayment}>
          {t('change_payment')}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
