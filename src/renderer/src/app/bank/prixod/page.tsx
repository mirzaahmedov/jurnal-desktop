import type { BankPrixodType } from '@/common/models'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { bankPrixodService } from './service'
import { GenericTable, FooterRow, FooterCell } from '@/common/components'
import { columns } from './columns'
import { formatNumber } from '@/common/lib/format'
import { queryKeys } from './constants'
import { useLayout } from '@/common/features/layout'
import { useMainSchet } from '@/common/features/main-schet'
import { useConfirm } from '@/common/features/confirm'
import { useRangeDate, usePagination } from '@/common/hooks'

import { ListView } from '@/common/views'

const BankPrixodPage = () => {
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
        ...pagination,
        ...dates
      }
    ],
    queryFn: bankPrixodService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: bankPrixodService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: BankPrixodType) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: BankPrixodType) => {
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
        <ListView.Pagination
          {...pagination}
          pageCount={prixodList?.meta.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default BankPrixodPage
