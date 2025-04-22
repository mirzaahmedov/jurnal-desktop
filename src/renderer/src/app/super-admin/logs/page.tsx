import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useDates } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { LogColumns } from './columns'
import { LogQueryKeys } from './config'
import { LogFilters } from './filter'
import { useLogType } from './hooks'
import { LogService } from './service'

const LogPage = () => {
  const dates = useDates()
  const setLayout = useLayout()

  const [type] = useLogType()

  const { t } = useTranslation(['app'])

  const { data: logs, isFetching } = useQuery({
    queryKey: [
      LogQueryKeys.getAll,
      {
        ...dates,
        type
      }
    ],
    queryFn: LogService.getAll
  })

  useEffect(() => {
    setLayout({
      title: t('pages.logs'),
      content: LogFilters
    })
  }, [setLayout, t])

  return (
    <ListView>
      <ListView.Header>
        <ListView.RangeDatePicker {...dates} />
      </ListView.Header>
      <ListView.Content loading={isFetching}>
        <GenericTable
          data={logs?.data ?? []}
          columnDefs={LogColumns}
        />
      </ListView.Content>
    </ListView>
  )
}

export default LogPage
