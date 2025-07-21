import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { useLocationState, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'

import { Nachislenies } from './nachislenie'
import { Reports } from './reports/reports'
import { TabelsView } from './tabel'
import { Vedemosts } from './vedemost/vedemost'

enum NachislenieTabOptions {
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

const NachisleniePage = () => {
  const setLayout = useLayout()

  const dialogToggle = useToggle()

  const [tabValue, setTabValue] = useLocationState('tabValue', NachislenieTabOptions.Tabel)

  const { t } = useTranslation(['app'])

  useEffect(() => {
    setLayout({
      title: t('nachislenie'),
      breadcrumbs: [
        {
          title: t('pages.zarplata')
        }
      ],
      onCreate: dialogToggle.open
    })
  }, [t, setLayout, dialogToggle.open])

  return (
    <div className="flex-1 min-h-0 p-5">
      <Tabs
        value={tabValue}
        onValueChange={(value) => setTabValue(value as any)}
        className="flex h-full w-full gap-5 overflow-hidden"
      >
        <div className="h-full overflow-hidden">
          <TabsList className="h-full w-full flex-col justify-start p-2 bg-transparent border">
            {tabOptions.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="w-full justify-start px-3 py-1.5 data-[state=active]:bg-brand/5 data-[state=active]:text-brand font-semibold !shadow-none"
              >
                {t(tab)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="border rounded-lg flex-1 h-full overflow-hidden">
          <TabsContent
            value={NachislenieTabOptions.Tabel}
            className="h-full mt-0"
          >
            <TabelsView />
          </TabsContent>
          <TabsContent
            value={NachislenieTabOptions.Nachislenie}
            className="h-full mt-0"
          >
            <Nachislenies />
          </TabsContent>
          <TabsContent
            value={NachislenieTabOptions.Reports}
            className="h-full mt-0"
          >
            <Reports />
          </TabsContent>
          <TabsContent
            value={NachislenieTabOptions.Vedemost}
            className="h-full mt-0"
          >
            <Vedemosts />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default NachisleniePage
