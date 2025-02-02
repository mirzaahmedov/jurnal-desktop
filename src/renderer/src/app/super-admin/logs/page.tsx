import { GenericTable } from '@renderer/common/components'
import { useLayout } from '@renderer/common/features/layout'
import { useRangeDate } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useQuery } from '@tanstack/react-query'

import { logColumns } from './columns'
import { logQueryKeys } from './config'
import { LogFilter } from './filter'
import { useLogType } from './hooks'
import { logService } from './service'

const Logs = () => {
  const [type] = useLogType()
  const dates = useRangeDate()

  const { data: logList, isFetching } = useQuery({
    queryKey: [logQueryKeys.getAll, { ...dates, type }],
    queryFn: logService.getAll
  })

  useLayout({ title: 'Логи', content: LogFilter })

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
