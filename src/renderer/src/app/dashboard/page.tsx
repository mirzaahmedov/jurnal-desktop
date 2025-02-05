import { useEffect, useState } from 'react'

import { DatePicker } from '@renderer/common/components'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/common/components/ui/tabs'
import { useLayoutStore } from '@renderer/common/features/layout'
import { formatDate } from '@renderer/common/lib/date'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { Bank } from './components/bank'
import { Kassa } from './components/kassa'
import { PodotchetTable } from './components/podotchet-table/podotchet-table'
import { queryKeys } from './config'
import { getDashboardBudjetOptionsQuery } from './service'

const DashboardPage = () => {
  const { data: budjets } = useSuspenseQuery({
    queryKey: [queryKeys.getBudjetOptions],
    queryFn: getDashboardBudjetOptionsQuery
  })

  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])

  const [date, setDate] = useState(formatDate(new Date()))
  const [budjet, setBudjet] = useState(budjets?.data?.[0].id ?? 0)

  useEffect(() => {
    setLayout({
      title: t('pages.main')
    })
  }, [setLayout, t])

  return (
    <div className="p-10 space-y-10">
      <Tabs
        value={budjet?.toString()}
        onValueChange={(value) => setBudjet(Number(value))}
      >
        <div className="flex items-center gap-5 justify-between">
          <DatePicker
            value={date ?? ''}
            onChange={setDate}
          />

          <TabsList>
            {budjets?.data?.map((budjet) => (
              <TabsTrigger
                value={budjet.id.toString()}
                key={budjet.id}
              >
                {budjet.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {budjets?.data?.map((elem) => (
          <TabsContent
            key={elem.id}
            value={elem.id.toString()}
          >
            <div className="flex flex-col gap-5 py-5">
              <div className="grid grid-cols-2 gap-10">
                <Kassa
                  main_schets={budjets?.data?.find((item) => item.id === budjet)?.main_schets}
                  date={date}
                  budjet_id={budjet}
                />
                <Bank
                  main_schets={budjets?.data?.find((item) => item.id === budjet)?.main_schets}
                  date={date}
                  budjet_id={budjet}
                />
              </div>
              <div>
                <PodotchetTable
                  date={date}
                  budjet_id={budjet}
                />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default DashboardPage
