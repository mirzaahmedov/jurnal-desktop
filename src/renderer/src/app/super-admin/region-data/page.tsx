import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { MonthPicker } from '@/common/components/month-picker'
import { usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { regionDataColumns } from './columns'
import { regionDataQueryKeys } from './config'
import { regionDataService } from './service'

const RegionDataPage = () => {
  const pagination = usePagination()
  const setLayout = useLayout()

  const [date, setDate] = useState('')
  const [year, month] = date.split('-')

  const { t } = useTranslation(['app'])

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
