import { GenericTable } from '@renderer/common/components'
import { ListView } from '@renderer/common/views'
import { columns } from './columns'
import { iznosQueryKeys } from './config'
import { iznosService } from './service'
import { useLayout } from '@renderer/common/features/layout'
import { useQuery } from '@tanstack/react-query'

const IznosPage = () => {
  const { data: iznosList, isFetching } = useQuery({
    queryKey: [
      iznosQueryKeys.getAll,
      {
        tovar_id: 16,
        responsible_id: 5
      }
    ],
    queryFn: iznosService.getAll
  })

  useLayout({
    title: 'Износ'
  })

  return (
    <ListView>
      <ListView.Content loading={isFetching}>
        <GenericTable
          columns={columns}
          data={(iznosList?.data ?? []).slice(0, 10)}
        />
      </ListView.Content>
    </ListView>
  )
}

export default IznosPage
