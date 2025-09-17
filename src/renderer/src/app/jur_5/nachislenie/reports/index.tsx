import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { MonthSelect } from '@/common/components/month-select'
import { YearSelect } from '@/common/components/year-select'
import { DownloadFile } from '@/common/features/file'
import { useRequisitesStore } from '@/common/features/requisites'

export const NachislenieReports = () => {
  const budjetId = useRequisitesStore((store) => store.budjet_id)

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  const { t } = useTranslation()

  return (
    <div className="p-20">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-gray-200 p-10">
        <div>
          <h2 className="mb-5 text-2xl font-semibold">{t('reports')}</h2>
        </div>
        <div className="flex items-center flex-wrap gap-5">
          <YearSelect
            selectedKey={year}
            onSelectionChange={(value) => setYear((value as number) || new Date().getFullYear())}
          />
          <MonthSelect
            selectedKey={month}
            onSelectionChange={(value) => setMonth((value as number) || new Date().getMonth() + 1)}
            className="w-48"
          />
        </div>

        <div className="flex items-center flex-wrap justify-end mt-10 gap-2.5">
          <DownloadFile
            isZarplata
            url="Nachislenie/vedemost"
            params={{
              spBudnameId: budjetId,
              year,
              month
            }}
            fileName={`zarplata_vedemost_${year}_${month}.xlsx`}
            buttonText={t('vedemost')}
            variant="default"
          />
          <DownloadFile
            isZarplata
            url="Excel/svod-otchet"
            params={{
              spBudnameId: budjetId,
              year,
              month
            }}
            fileName={`zarplata_svod_${year}_${month}.xlsx`}
            buttonText={t('aggregated_report')}
            variant="default"
          />
          <DownloadFile
            isZarplata
            url="Excel/inps-otchet"
            params={{
              spBudnameId: budjetId,
              year,
              month
            }}
            fileName={`inps_${year}_${month}.xlsx`}
            buttonText={t('inps')}
            variant="default"
          />
          <DownloadFile
            isZarplata
            url="Excel/podoxod-otchet"
            params={{
              spBudnameId: budjetId,
              year,
              month
            }}
            fileName={`podoxod_${year}_${month}.xlsx`}
            buttonText={t('podoxod')}
            variant="default"
          />
          <DownloadFile
            isZarplata
            url="Excel/plastik-otchet"
            params={{
              spBudnameId: budjetId,
              year,
              month
            }}
            fileName={`plastik_${year}_${month}.xlsx`}
            buttonText={t('plastik')}
            variant="default"
          />
        </div>
      </div>
    </div>
  )
}
