import type { Dashboard } from '../model'
import type { ChartConfig } from '@/common/components/ui/chart'

import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/common/components/ui/card'
import { getColors } from '@/common/lib/color'
import { formatNumber } from '@/common/lib/format'

import { queryKeys } from '../config'
import { getDashboardBankQuery } from '../service'
import { GenericPieChart } from './generic-pie-chart'

export interface BankProps {
  date?: string
  budjet_id?: number
  main_schets?: Dashboard.Budjet['main_schets']
}
export const Bank = ({ budjet_id, date, main_schets }: BankProps) => {
  const { t } = useTranslation(['dashboard'])

  const { data } = useQuery({
    queryKey: [
      queryKeys.getBankFunds,
      {
        to: date!,
        budjet_id: Number(budjet_id)!
      }
    ],
    queryFn: getDashboardBankQuery,
    enabled: !!date && !!budjet_id
  })

  const chartConfig = useMemo(() => {
    return !Array.isArray(main_schets)
      ? {}
      : main_schets.reduce((config, schet) => {
          config[schet.id] = {
            label: `${schet.account_number} / ${schet.jur2_schet}`
          }
          return config
        }, {} as ChartConfig)
  }, [main_schets])

  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return []

    const colors = getColors(data.length)
    return data.map((schet, i) => ({
      main_schet_id: schet?.id,
      summa: schet?.bank?.summa ?? 0,
      fill: colors[i]
    }))
  }, [data])

  const total = useMemo(() => {
    return data?.reduce((total, item) => total + item.bank.summa, 0) ?? 0
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('bank')}</CardTitle>
        <CardDescription>{t('bank-available-funds')}</CardDescription>
      </CardHeader>
      <CardContent>
        <GenericPieChart
          data={chartData}
          config={chartConfig}
          total={total}
        />
        <ul className="text-slate-700">
          <li className="mb-4 flex justify-between">
            <b className="text-sm">
              {t('raschet-schet')} / {t('schet')}
            </b>
            <b className="text-sm">{t('summa')}</b>
          </li>
          {data?.map((schet) => (
            <li
              key={schet.id}
              className="flex justify-between"
            >
              <div className="flex gap-5">
                <span
                  className="size-5 rounded-full"
                  style={{
                    backgroundColor: chartData.find((item) => item.main_schet_id === schet.id)?.fill
                  }}
                ></span>
                <span>
                  {schet.account_number} / {schet.jur2_schet}
                </span>
              </div>
              <b className="text-lg">{formatNumber(schet.bank?.summa)}</b>
            </li>
          ))}
          <li className="mt-2 flex justify-between">
            <b>{t('total')}</b>
            <b className="text-lg">{formatNumber(total)}</b>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
