import type { KassaRasxodType } from '@/common/models'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { kassaRasxodService } from './service'
import { GenericTable, Pagination, FooterRow, FooterCell } from '@/common/components'
import { columns } from './columns'
import { formatNumber } from '@/common/lib/format'
import { queryKeys } from './constants'
import { useLayout } from '@/common/features/layout'
import { useMainSchet } from '@/common/features/main-schet'
import { useConfirm } from '@/common/features/confirm'

import { ListView } from '@/common/views'
import { useRangeDate, usePagination } from '@/common/hooks'

const KassaRasxodPage = () => {
  const { main_schet } = useMainSchet()
  const { confirm } = useConfirm()

  const dates = useRangeDate()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: rasxodList, isFetching } = useQuery({
    queryKey: [
      queryKeys.getAll,
      {
        main_schet_id: main_schet?.id,
        ...dates,
        ...pagination
      }
    ],
    queryFn: kassaRasxodService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: kassaRasxodService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: KassaRasxodType) => {
    navigate(`${row.id}`)
  }

  const handleClickDelete = (row: KassaRasxodType) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  useLayout({
    title: 'Расходные документы',
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
          data={rasxodList?.data ?? []}
          columns={columns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          footer={
            <FooterRow>
              <FooterCell
                title="Итого"
                content={formatNumber(rasxodList?.meta?.summa ?? 0)}
                colSpan={4}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <Pagination {...pagination} pageCount={rasxodList?.meta.pageCount ?? 0} />
      </ListView.Footer>
    </ListView>
  )
}

export default KassaRasxodPage
