import type { KassaPrixodType } from '@/common/models'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { GenericTable, FooterRow, FooterCell } from '@/common/components'
import { columns } from './columns'
import { formatNumber } from '@/common/lib/format'
import { kassaPrixodService } from './service'
import { queryKeys } from './constants'
import { useMainSchet } from '@/common/features/main-schet'
import { useLayout } from '@/common/features/layout'
import { useConfirm } from '@/common/features/confirm'

import { ListView } from '@/common/views'
import { useRangeDate, usePagination } from '@/common/hooks'

const KassaPrixodPage = () => {
  const { main_schet } = useMainSchet()
  const { confirm } = useConfirm()

  const dates = useRangeDate()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: prixodList, isFetching } = useQuery({
    queryKey: [
      queryKeys.getAll,
      {
        main_schet_id: main_schet?.id,
        ...dates,
        ...pagination
      }
    ],
    queryFn: kassaPrixodService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: kassaPrixodService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: KassaPrixodType) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: KassaPrixodType) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  useLayout({
    title: 'Приходные документы',
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
          data={prixodList?.data ?? []}
          columns={columns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          footer={
            <FooterRow>
              <FooterCell
                title="Итого"
                content={formatNumber(prixodList?.meta?.summa ?? 0)}
                colSpan={4}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination {...pagination} pageCount={prixodList?.meta.pageCount ?? 0} />
      </ListView.Footer>
    </ListView>
  )
}

export default KassaPrixodPage
