import { useTranslation } from 'react-i18next'

import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { useLocationState } from '@/common/hooks'

export enum NachislenieTabOptions {
  Tabel = 'tabel',
  Nachislenie = 'nachislenie',
  Reports = 'reports',
  Vedemost = 'vedemost'
}

const tabOptions = [
  NachislenieTabOptions.Tabel,
  NachislenieTabOptions.Nachislenie,
  NachislenieTabOptions.Reports,
  NachislenieTabOptions.Vedemost
]

export const useNachislenieTab = () => {
  return useLocationState('tab', NachislenieTabOptions.Tabel)
}

export const NachislenieTabs = () => {
  const [tabValue, setTabValue] = useNachislenieTab()

  const { t } = useTranslation(['app'])

  return (
    <Tabs
      value={tabValue}
      onValueChange={(value) => setTabValue(value as NachislenieTabOptions)}
    >
      <TabsList>
        {tabOptions.map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
          >
            {t(tab)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
