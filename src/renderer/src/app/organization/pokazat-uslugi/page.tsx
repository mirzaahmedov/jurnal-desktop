import { toast, usePagination, useRangeDate } from '@/common/hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { GenericTable } from '@/common/components'
import { ListView } from '@/common/views'
import type { PokazatUslugi } from '@/common/models'
import { pokazatUslugiColumns } from './columns'
import { pokazatUslugiService } from './service'
import { queryKeys } from './constants'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useNavigate } from 'react-router-dom'
import { useRequisitesStore } from '@renderer/common/features/requisites'

const PokazatUslugiPage = () => {
  const { confirm } = useConfirm()

  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const dates = useRangeDate()

  const { data: pokazatUslugiList, isFetching } = useQuery({
    queryKey: [
      queryKeys.getAll,
      {
        main_schet_id,
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
    },
    onError() {
      toast({
        title: 'Ошибка при удалении показа услуги',
        variant: 'destructive'
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
          columnDefs={pokazatUslugiColumns}
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
