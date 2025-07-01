import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { MonthPicker } from '@/common/components/month-picker'
import { usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { RegionDataColumns } from './columns'
import { RegionDataQueryKeys } from './config'
import { RegionDataService } from './service'

const RegionDataPage = () => {
  const pagination = usePagination()
  const setLayout = useLayout()

  const [date, setDate] = useState('')
  const [year, month] = date.split('-')

  const { t } = useTranslation(['app'])

  const { data: regionDataList, isFetching } = useQuery({
    queryKey: [
      RegionDataQueryKeys.getAll,
      {
        year,
        month,
        ...pagination
      }
    ],
    queryFn: RegionDataService.getAll
  })

  useEffect(() => {
    setLayout({
      title: t('pages.region-data')
    })
  }, [setLayout, t])

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
      <ListView.Content isLoading={isFetching}>
        <GenericTable
          columnDefs={RegionDataColumns}
          data={(regionDataList?.data ?? [])?.sort(
            (a, b) => b?.counts?.total_count - a?.counts?.total_count
          )}
        />
      </ListView.Content>
    </ListView>
  )
}

export default RegionDataPage
