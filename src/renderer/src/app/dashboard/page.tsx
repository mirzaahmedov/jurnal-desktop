import { useEffect } from 'react'

import { DatePicker, SelectField } from '@renderer/common/components'
import { Card } from '@renderer/common/components/ui/card'
import { useLayoutStore } from '@renderer/common/features/layout'
import { formatDate } from '@renderer/common/lib/date'
import { formatNumber } from '@renderer/common/lib/format'
import { useQuery } from '@tanstack/react-query'
import { parseAsString, useQueryState } from 'nuqs'
import { useTranslation } from 'react-i18next'

import KassaBalance from './components/kassa-balance'
import { queryKeys } from './config'
import {
  getDashboardBankQuery,
  getDashboardBudjetOptionsQuery,
  getDashboardKassaQuery
} from './service'

const DashboardPage = () => {
  const [date, setDate] = useQueryState('date', parseAsString.withDefault(formatDate(new Date())))
  const [budjet, setBudjet] = useQueryState('budjet', parseAsString.withDefault(''))

  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])

  const { data: budjets, isFetching: isFetchingBudjets } = useQuery({
    queryKey: [queryKeys.getBudjetOptions],
    queryFn: getDashboardBudjetOptionsQuery
  })
  const { data: kassa, isFetching: isFetchingKassa } = useQuery({
    queryKey: [
      queryKeys.getKassaFunds,
      {
        to: date!,
        budjet_id: Number(budjet)!
      }
    ],
    queryFn: getDashboardKassaQuery,
    enabled: !!date && !!budjet
  })
  const { data: bank, isFetching: isFetchingBank } = useQuery({
    queryKey: [
      queryKeys.getBankFunds,
      {
        to: date!,
        budjet_id: Number(budjet)!
      }
    ],
    queryFn: getDashboardBankQuery,
    enabled: !!date && !!budjet
  })

  useEffect(() => {
    setLayout({
      title: t('pages.main')
    })
  }, [setLayout, t])

  return (
    <div className="p-10 gap-10 space-y-5">
      <div className="flex items-center gap-5 justify-start">
        <DatePicker
          value={date ?? ''}
          onChange={setDate}
        />
        <SelectField
          placeholder={t('choose', { what: t('budjet') })}
          value={budjet}
          onValueChange={setBudjet}
          options={budjets?.data ?? []}
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.name}
          triggerClassName="max-w-xs"
        />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <Card className="p-5">
          {Array.isArray(kassa?.data)
            ? kassa.data[0].main_schets.map((schet) => (
                <div key={schet.id}>
                  {schet.account_number}/{schet.jur1_schet} - {formatNumber(schet.kassa.summa)}
                </div>
              ))
            : null}
        </Card>
        <Card className="p-5">
          <KassaBalance />
          <div className="pb-2.5 flex justify-between">
            <h5 className="uppercase text-xs font-bold text-brand">
              {t('raschet-schet')} / {t('schet')}
            </h5>
            <h5 className="uppercase text-xs font-bold text-brand">{t('summa')}</h5>
          </div>
          <ul>
            {Array.isArray(bank?.data)
              ? bank.data[0].main_schets.map((schet) => (
                  <li
                    key={schet.id}
                    className="flex justify-between"
                  >
                    <span className="text-sm">
                      {schet.account_number} / {schet.jur1_schet}
                    </span>
                    <span className="text-base font-medium">{formatNumber(schet.bank.summa)}</span>
                  </li>
                ))
              : null}
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
