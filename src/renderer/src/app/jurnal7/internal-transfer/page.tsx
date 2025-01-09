import { GenericTable, LoadingOverlay } from '@/common/components'
import { columns, queryKeys } from './config'
import { useInternalTransferDelete, useInternalTransferList } from './service'

import { DateRangeForm } from '../common/components/date-range-form'
import { toast } from '@/common/hooks/use-toast'
import { useConfirm } from '@/common/features/confirm'
import { useJurnal7DateRange } from '../common/components/use-date-range'
import { useLayout } from '@/common/features/layout'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useRequisitesStore } from '@renderer/common/features/requisites'

const InternalTransferPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

  const { confirm } = useConfirm()
  const { form, from, to, applyFilters } = useJurnal7DateRange()

  const { mutate: deleteInternalTransfer } = useInternalTransferDelete({
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      toast({
        title: 'Внутренний перевод успешно удален'
      })
    },
    onError() {
      toast({
        title: 'Ошибка при удалении внутреннего перевода',
        variant: 'destructive'
      })
    }
  })
  const { data: transferList, isFetching } = useInternalTransferList({
    params: {
      main_schet_id,
      limit: 10,
      page: 1,
      from,
      to
    }
  })

  useLayout({
    title: 'Внутрь. пере. документ',
    onCreate() {
      navigate('create')
    }
  })

  return (
    <>
      <div className="p-5">
        <DateRangeForm
          form={form}
          onSubmit={applyFilters}
        />
      </div>
      <div className="flex-1 relative">
        {isFetching ? <LoadingOverlay /> : null}
        <GenericTable
          columns={columns}
          data={transferList?.data ?? []}
          onEdit={(row) => navigate(`${row.id}`)}
          onDelete={(row) => {
            confirm({
              title: 'Удалить внутренний перевод?',
              onConfirm: () => deleteInternalTransfer(row.id)
            })
          }}
        />
      </div>
    </>
  )
}

export { InternalTransferPage }
