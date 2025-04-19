import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useDates } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { logColumns } from './columns'
import { logQueryKeys } from './config'
import { LogFilter } from './filter'
import { useLogType } from './hooks'
import { logService } from './service'

const Logs = () => {
  const dates = useDates()
  const setLayout = useLayout()

  const [type] = useLogType()

  const { t } = useTranslation(['app'])

  const { data: logList, isFetching } = useQuery({
    queryKey: [logQueryKeys.getAll, { ...dates, type }],
    queryFn: logService.getAll
  })

  useEffect(() => {
    setLayout({
      title: t('pages.logs'),
      content: LogFilter
    })
  }, [setLayout, t])

  return (
    <ListView>
      <ListView.Header>
        <ListView.RangeDatePicker {...dates} />
      </ListView.Header>
      <ListView.Content loading={isFetching}>
        <GenericTable
          data={logList?.data ?? []}
          columnDefs={logColumns}
        />
      </ListView.Content>
    </ListView>
  )
}

export default Logs
