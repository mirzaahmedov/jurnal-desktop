import type { PokazatUslugi } from '@/common/models'

import { useNavigate } from 'react-router-dom'
import { GenericTable } from '@/common/components'
import { pokazatUslugiColumns } from './columns'
import { queryKeys } from './constants'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pokazatUslugiService } from './service'
import { useLayout } from '@/common/features/layout'
import { useMainSchet } from '@/common/features/main-schet'
import { useConfirm } from '@/common/features/confirm'

import { ListView } from '@/common/views'
import { useRangeDate, usePagination } from '@/common/hooks'

const PokazatUslugiPage = () => {
  const { main_schet } = useMainSchet()
  const { confirm } = useConfirm()

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const dates = useRangeDate()

  const { data: pokazatUslugiList, isFetching } = useQuery({
    queryKey: [
      queryKeys.getAll,
      {
        main_schet_id: main_schet?.id,
        ...dates,
        ...pagination
      }
    ],
    queryFn: pokazatUslugiService.getAll
  })
  const { mutate: deletePokazatUslugi, isPending } = useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: pokazatUslugiService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: PokazatUslugi) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: PokazatUslugi) => {
    confirm({
      onConfirm() {
        deletePokazatUslugi(row.id)
      }
    })
  }

  useLayout({
    title: 'Показать услуги',
    onCreate: () => {
      navigate('create')
    }
  })

  return (
    <ListView>
      <ListView.Header>
        <ListView.RangeDatePicker {...dates} />
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={pokazatUslugiList?.data ?? []}
          columns={pokazatUslugiColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={pokazatUslugiList?.meta.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default PokazatUslugiPage
