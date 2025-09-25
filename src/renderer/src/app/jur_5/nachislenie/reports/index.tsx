import { useEffect, useState } from 'react'

import { ChevronLeft, ChevronRight, CircleArrowDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { DownloadFile } from '@/common/features/file'
import { useRequisitesStore } from '@/common/features/requisites'
import { useLayout } from '@/common/layout'
import { formatDate } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'

import { NachislenieTabs } from '../nachislenie-tabs'

export const NachislenieReports = () => {
  const budjetId = useRequisitesStore((store) => store.budjet_id)
  const setLayout = useLayout()

  const [startDate, setStartDate] = useState(formatDate(new Date()))
  const [endDate, setEndDate] = useState(formatDate(new Date()))

  const { t } = useTranslation(['app'])

  useEffect(() => {
    setLayout({
      title: t('reports'),
      breadcrumbs: [
        {
          title: t('pages.zarplata')
        }
      ],
      content: NachislenieTabs
    })
  }, [t, setLayout])

  const handleNextDay = (field: 'from' | 'to', amount: number) => {
    const date = new Date(field === 'from' ? startDate! : endDate!)
    date.setDate(date.getDate() + amount)
    const newDate = date.toISOString().split('T')[0]
    if (field === 'from') setStartDate(newDate)
    else setEndDate(newDate)
  }
  const handlePrevDay = (field: 'from' | 'to', amount: number) => {
    const date = new Date(field === 'from' ? startDate! : endDate!)
    date.setDate(date.getDate() - amount)
    const newDate = date.toISOString().split('T')[0]
    if (field === 'from') setStartDate(newDate)
    else setEndDate(newDate)
  }

  const from = formatLocaleDate(startDate)
  const to = formatLocaleDate(endDate)

  return (
    <div className="p-20">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-gray-200 p-10">
        <div>
          <h2 className="mb-5 text-2xl font-semibold">{t('reports')}</h2>
        </div>
        <div className="flex items-center flex-wrap gap-5">
          <div className="flex items-center flex-wrap gap-x-1 gap-y-2.5">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onPress={() => handlePrevDay('from', 1)}
            >
              <ChevronLeft className="btn-icon" />
            </Button>
            <JollyDatePicker
              autoFocus
              value={startDate}
              onChange={(date) => setStartDate(date)}
              containerProps={{ className: 'w-36 min-w-36' }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onPress={() => handleNextDay('from', 1)}
            >
              <ChevronRight className="btn-icon" />
            </Button>
            <b className="mx-0.5">-</b>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onPress={() => handlePrevDay('to', 1)}
            >
              <ChevronLeft className="btn-icon" />
            </Button>
            <JollyDatePicker
              value={endDate}
              onChange={(date) => setEndDate(date)}
              containerProps={{ className: 'w-36 min-w-36' }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onPress={() => handleNextDay('to', 1)}
            >
              <ChevronRight className="btn-icon" />
            </Button>
            <div className="space-x-1">
              <Button type="submit">
                <CircleArrowDown className="btn-icon icon-start" />
                {t('load')}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap justify-end mt-10 gap-2.5">
          <DownloadFile
            isZarplata
            url="Excel/inps-otchet"
            params={{
              spBudnameId: budjetId,
              from,
              to
            }}
            fileName={`inps_${startDate}_${endDate}.xlsx`}
            buttonText={t('inps')}
            variant="default"
          />
          <DownloadFile
            isZarplata
            url="Excel/podoxod-otchet"
            params={{
              spBudnameId: budjetId,
              from,
              to
            }}
            fileName={`podoxod_${startDate}_${endDate}.xlsx`}
            buttonText={t('podoxod')}
            variant="default"
          />
          <DownloadFile
            isZarplata
            url="Excel/plastik-otchet"
            params={{
              spBudnameId: budjetId,
              from,
              to
            }}
            fileName={`plastik_${startDate}_${endDate}.xlsx`}
            buttonText={t('plastik')}
            variant="default"
          />
          <DownloadFile
            isZarplata
            url="Excel/jur5-otchet"
            params={{
              spBudnameId: budjetId,
              from,
              to
            }}
            fileName={`${t('monthly_report')}_${startDate}_${endDate}.xlsx`}
            buttonText={t('monthly_report')}
            variant="default"
          />
        </div>
      </div>
    </div>
  )
}
