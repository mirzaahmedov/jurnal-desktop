import type { AdminDashboardKassa } from '../model'

import { useMemo } from 'react'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { getKassaChartOptions } from './utils'

export interface AdminDashboardKassaPieChartProps {
  data: AdminDashboardKassa[]
}
export const AdminDashboardKassaPieChart = ({ data }: AdminDashboardKassaPieChartProps) => {
  const options = useMemo(
    () =>
      getKassaChartOptions({
        data: data?.map(
          (item) =>
            ({
              status_id: item?.budjets,
              color: item,
              name: item.status_data.name,
              y: item.count,
              percent: item.percent
            }) satisfies StatusPieData
        ),
        onSelect: onSelectEvent
      }),
    [data, onSelectEvent]
  )

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  )
}
