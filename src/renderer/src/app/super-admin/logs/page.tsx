import { GenericTable } from '@renderer/common/components'
import { ListView } from '@renderer/common/views'
import { LogFilter } from './filter'
import { logColumns } from './columns'
import { logQueryKeys } from './config'
import { logService } from './service'
import { useLayout } from '@renderer/common/features/layout'
import { useLogType } from './hooks'
import { useQuery } from '@tanstack/react-query'
import { useRangeDate } from '@renderer/common/hooks'

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
          columns={logColumns}
        />
      </ListView.Content>
    </ListView>
  )
}

export default Logs
