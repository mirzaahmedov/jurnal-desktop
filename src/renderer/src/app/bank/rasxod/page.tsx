import { FooterCell, FooterRow, GenericTable } from '@/common/components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usePagination, useRangeDate } from '@/common/hooks'

import type { BankRasxodType } from '@/common/models'
import { ListView } from '@/common/views'
import { bankRasxodService } from './service'
import { columns } from './columns'
import { formatNumber } from '@/common/lib/format'
import { queryKeys } from './constants'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useNavigate } from 'react-router-dom'
import { useRequisitesStore } from '@/common/features/main-schet'

const BankRasxodPage = () => {
  const { confirm } = useConfirm()

  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const dates = useRangeDate()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: rasxodList, isFetching } = useQuery({
    queryKey: [
      queryKeys.getAll,
      {
        main_schet_id,
        ...dates,
        ...pagination
      }
    ],
    queryFn: bankRasxodService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: bankRasxodService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
    }
  })

  useLayout({
    title: 'Расходные документы',
    onCreate() {
      navigate('create')
    }
  })

  const handleClickEdit = (row: BankRasxodType) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: BankRasxodType) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

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
        <ListView.Pagination
          {...pagination}
          pageCount={rasxodList?.meta.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default BankRasxodPage
