import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { useLayout } from '@/common/layout'
import { formatDate } from '@/common/lib/date'

import { BudjetSelect } from '../budjet/budjet-select'
import { AdminDashboardKassa } from './components/admin-dashboard-kassa'
import { AdminDashboardPodotchetTable } from './components/admin-dashboard-podotchet-table'
import { RegionSelect } from './components/region-select'

const AdminDashboardPage = () => {
  const setLayout = useLayout()

  const { t } = useTranslation(['app'])

  const [date, setDate] = useState(formatDate(new Date()))
  const [regionId, setRegionId] = useState<number>()
  const [budjetId, setBudjetId] = useState<number>()

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
        <RegionSelect
          selectedKey={regionId ?? null}
          onSelectionChange={(value) => setRegionId(value ? (value as number) : undefined)}
        />
        <BudjetSelect
          selectedKey={budjetId ?? null}
          onSelectionChange={(value) => setBudjetId(value ? (value as number) : undefined)}
        />
      </div>

      <div>
        <div className="flex flex-col gap-5 py-5">
          <div className="grid grid-cols-1 min-[1200px]:grid-cols-2 gap-5">
            <AdminDashboardKassa
              date={date}
              budjetId={budjetId}
            />
            <AdminDashboardKassa
              date={date}
              budjetId={budjetId}
            />
          </div>
          <div>
            <AdminDashboardPodotchetTable
              date={date}
              region_id={regionId}
              budjet_id={budjetId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
