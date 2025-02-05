import type { Dashboard } from '../model'
import type { ChartConfig } from '@renderer/common/components/ui/chart'

import { useMemo } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/common/components/ui/card'
import { formatNumber } from '@renderer/common/lib/format'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { queryKeys } from '../config'
import { getDashboardKassaQuery } from '../service'
import { GenericPieChart } from './generic-pie-chart'

export interface KassaProps {
  date?: string
  budjet_id?: number
  main_schets?: Dashboard.Budjet['main_schets']
}
export const Kassa = ({ budjet_id, date, main_schets }: KassaProps) => {
  const { t } = useTranslation(['dashboard'])

  const { data } = useQuery({
    queryKey: [
      queryKeys.getKassaFunds,
      {
        to: date!,
        budjet_id: Number(budjet_id)!
      }
    ],
    queryFn: getDashboardKassaQuery,
    enabled: !!date && !!budjet_id
  })

  const chartConfig = useMemo(() => {
    return (
      main_schets?.reduce((config, schet) => {
        config[schet.id] = {
          label: `${schet.account_number} / ${schet.jur1_schet}`
        }
        return config
      }, {} as ChartConfig) ?? {}
    )
  }, [main_schets])

  const chartData = useMemo(() => {
    return (
      data?.map((schet) => ({
        main_schet_id: schet?.id,
        summa: schet?.kassa?.summa ?? 0,
        fill: getRandomColor()
      })) ?? []
    )
  }, [data])

  const total = useMemo(() => {
    return data?.reduce((total, item) => total + item.kassa.summa, 0) ?? 0
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('kassa')}</CardTitle>
        <CardDescription>{t('kassa-available-funds')}</CardDescription>
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
                  {schet.account_number} / {schet.jur1_schet}
                </span>
              </div>
              <b className="text-lg">{formatNumber(schet.kassa?.summa)}</b>
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

const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`
}
