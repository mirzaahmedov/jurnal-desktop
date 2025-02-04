import { GenericTable } from '@renderer/common/components'
import { useLayout } from '@renderer/common/features/layout'
import { useDates } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { logColumns } from './columns'
import { logQueryKeys } from './config'
import { LogFilter } from './filter'
import { useLogType } from './hooks'
import { logService } from './service'

const Logs = () => {
  const [type] = useLogType()
  const dates = useDates()

  const { t } = useTranslation(['app'])

  const { data: logList, isFetching } = useQuery({
    queryKey: [logQueryKeys.getAll, { ...dates, type }],
    queryFn: logService.getAll
  })

  useLayout({
    title: t('pages.logs'),
    content: LogFilter
  })

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
