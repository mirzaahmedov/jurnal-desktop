import { useState } from 'react'

import { GenericTable } from '@renderer/common/components'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { useLayout } from '@renderer/common/features/layout'
import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useQuery } from '@tanstack/react-query'

import { regionDataColumns } from './columns'
import { regionDataQueryKeys } from './config'
import { regionDataService } from './service'

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
          columnDefs={regionDataColumns}
          data={(regionDataList?.data ?? [])?.sort(
            (a, b) => b?.counts?.total_count - a?.counts?.total_count
          )}
        />
      </ListView.Content>
    </ListView>
  )
}

export default RegionDataPage
