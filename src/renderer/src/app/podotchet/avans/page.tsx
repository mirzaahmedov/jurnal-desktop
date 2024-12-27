import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usePagination, useRangeDate } from '@/common/hooks'

import { Avans } from '@/common/models'
import { GenericTable } from '@/common/components'
import { ListView } from '@/common/views'
import { avansColumns } from './columns'
import { avansQueryKeys } from './constants'
import { avansService } from './service'
import { toast } from '@/common/hooks/use-toast'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useNavigate } from 'react-router-dom'
import { useRequisitesStore } from '@/common/features/main-schet'

const AvansPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const dates = useRangeDate()
  const pagination = usePagination()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const { confirm } = useConfirm()

  const { data: avansList, isFetching } = useQuery({
    queryKey: [
      avansQueryKeys.getAll,
      {
        main_schet_id,
        ...dates,
        ...pagination
      }
    ],
    queryFn: avansService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [avansQueryKeys.delete],
    mutationFn: avansService.delete,
    onSuccess() {
      toast({
        title: 'Документ успешно удалён'
      })
      queryClient.invalidateQueries({
        queryKey: [avansQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: Avans) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: Avans) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  useLayout({
    title: 'Авансовые отчёты',
    onCreate() {
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
          columns={avansColumns}
          data={avansList?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={avansList?.meta.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default AvansPage
