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

import { AdminDashboardService } from '../service'

export interface AdminDashboardKassaProps {
  date?: string
  budjetId?: number
}
export const AdminDashboardKassa = ({ budjetId, date }: AdminDashboardKassaProps) => {
  const { t } = useTranslation(['dashboard'])

  console.log({ date, budjetId })

  const { data } = useQuery({
    queryKey: [
      AdminDashboardService.QueryKeys.Kassa,
      {
        to: date!,
        budjet_id: Number(budjetId)!,
        region_id: 1
      }
    ],
    queryFn: AdminDashboardService.getKassa,
    enabled: !!date && !!budjetId
  })

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
        {/* <GenericPieChart
          data={chartData}
          config={chartConfig}
          total={total}
        /> */}
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
