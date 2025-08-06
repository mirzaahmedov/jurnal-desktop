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

import { DashboardQueryKeys } from '../config'
import { getDashboardKassaQuery } from '../service'
import { GenericPieChart } from './generic-pie-chart'

export interface KassaProps {
  date?: string
  budjetId?: number
  mainSchets?: Dashboard.Budjet['main_schets']
}
export const Kassa = ({ budjetId, date, mainSchets }: KassaProps) => {
  const { t } = useTranslation(['dashboard'])

  const { data } = useQuery({
    queryKey: [
      DashboardQueryKeys.getKassaFunds,
      {
        to: date!,
        budjet_id: Number(budjetId)!
      }
    ],
    queryFn: getDashboardKassaQuery,
    enabled: !!date && !!budjetId
  })

  const chartConfig = useMemo(() => {
    if (!Array.isArray(mainSchets)) return {}

    return mainSchets.reduce((config, schet) => {
      config[schet.id] = {
        label: `${schet?.main_schet?.account_number} - ${schet?.main_schet?.jur1_schet}`
      }
      return config
    }, {} as ChartConfig)
  }, [mainSchets])

  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return []

    const colors = getColors(data.length)
    return data?.map((schet, i) => ({
      main_schet_id: schet?.id,
      summa: schet?.kassa?.summa ?? 0,
      fill: colors[i]
    }))
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
              {t('raschet-schet')} - {t('schet')}
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
                  {schet.main_schet?.account_number} - {schet.main_schet?.jur1_schet}
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
