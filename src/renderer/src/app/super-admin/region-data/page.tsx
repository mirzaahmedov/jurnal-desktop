import { GenericTable } from '@renderer/common/components'
import { ListView } from '@renderer/common/views'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { regionDataColumns } from './columns'
import { regionDataQueryKeys } from './config'
import { regionDataService } from './service'
import { useLayout } from '@renderer/common/features/layout'
import { usePagination } from '@renderer/common/hooks'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const RegionDataPage = () => {
  const [date, setDate] = useState('')
  const [year, month] = date.split('-')

  const pagination = usePagination()

  const { data: regionDataList, isFetching } = useQuery({
    queryKey: [
      regionDataQueryKeys.getAll,
      {
        year,
        month,
        ...pagination
      }
    ],
    queryFn: regionDataService.getAll
  })

  useLayout({
    title: 'Данные по регионам'
  })

  return (
    <ListView>
      <ListView.Header>
        <MonthPicker
          value={date}
          onChange={setDate}
          id="month"
          name="month"
        />
      </ListView.Header>
      <ListView.Content loading={isFetching}>
        <GenericTable
          columns={regionDataColumns}
          data={(regionDataList?.data ?? [])?.sort(
            (a, b) => b?.counts?.total_count - a?.counts?.total_count
          )}
        />
      </ListView.Content>
    </ListView>
  )
}

export default RegionDataPage
