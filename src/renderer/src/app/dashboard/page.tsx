import { useEffect, useState } from 'react'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { BudjetSelect } from '@/app/super-admin/budjet/budjet-select'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { useLayout } from '@/common/layout'
import { formatDate } from '@/common/lib/date'

import { Bank } from './components/bank'
import { Kassa } from './components/kassa'
import { DashboardPodotchetTable } from './components/podotchet-table/podotchet-table'
import { DashboardQueryKeys } from './config'
import { getDashboardBudjetOptionsQuery } from './service'

const DashboardPage = () => {
  const { data: budjets } = useSuspenseQuery({
    queryKey: [DashboardQueryKeys.getBudjetOptions],
    queryFn: getDashboardBudjetOptionsQuery
  })

  const setLayout = useLayout()

  const { t } = useTranslation(['app'])

  const [date, setDate] = useState(formatDate(new Date()))
  const [budjetId, setBudjetId] = useState(budjets?.data?.[0].id ?? 0)

  useEffect(() => {
    setLayout({
      title: t('pages.main')
    })
  }, [setLayout, t])

  return (
    <div className="p-5 h-full overflow-y-auto scrollbar">
      <div className="flex items-center gap-5 justify-between">
        <JollyDatePicker
          value={date ?? ''}
          onChange={setDate}
        />
        <BudjetSelect
          withFirstOptionSelected
          selectedKey={budjetId}
          onSelectionChange={(value) => setBudjetId(Number(value))}
        />
      </div>

      {budjets?.data?.map((elem) => {
        const mainSchets = budjets?.data?.find((item) => item.id === budjetId)?.main_schets
        return (
          <div
            key={elem.id}
            hidden={elem.id !== budjetId}
          >
            <div className="flex flex-col gap-5 py-5">
              <div className="grid grid-cols-1 min-[1200px]:grid-cols-2 gap-5">
                <Kassa
                  mainSchets={mainSchets}
                  date={date}
                  budjetId={budjetId}
                />
                <Bank
                  mainSchets={mainSchets}
                  date={date}
                  budjetId={budjetId}
                />
              </div>
              <div>
                <DashboardPodotchetTable
                  date={date}
                  budjet_id={budjetId}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DashboardPage
