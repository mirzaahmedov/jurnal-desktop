import { useMemo } from 'react'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { useEventCallback } from '@/common/hooks'

import { getRegionChartOptions } from './charts'

export interface AdminDashboardPieChartContainerProps<T extends object> {
  items: T[]
  onSelect?: (item: T) => void
}
export const AdminDashboardPieChartContainer = <
  T extends { id: number; name: string; summa: number }
>({
  items,
  onSelect
}: AdminDashboardPieChartContainerProps<T>) => {
  const onSelectCallback = useEventCallback(onSelect)

  const options = useMemo(
    () =>
      getRegionChartOptions({
        items,
        onSelect: onSelectCallback as any
      }),
    [items, onSelectCallback]
  )

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  )
}
