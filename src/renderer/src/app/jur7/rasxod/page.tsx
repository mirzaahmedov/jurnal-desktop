import { DateRangeForm, GenericTable, LoadingOverlay } from '@/common/components'
import { useLayout } from '@/common/features/layout'
import { useNavigate } from 'react-router-dom'
import { useRasxodDelete, useRasxodList } from './service'
import { useDateRange } from '@/common/hooks/use-date-range'

import { columns, queryKeys } from './config'
import { useQueryClient } from '@tanstack/react-query'
import { useConfirm } from '@/common/features/confirm'
import { toast } from '@/common/hooks/use-toast'
import { useMainSchet } from '@/common/features/main-schet'

const MO7RasxodPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { confirm } = useConfirm()
  const { main_schet } = useMainSchet()
  const { form, from, to, applyFilters } = useDateRange()

  const { mutate: deleteRasxod } = useRasxodDelete({
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      toast({
        title: 'Расход успешно удален'
      })
    },
    onError() {
      toast({
        title: 'Ошибка при удалении расхода',
        variant: 'destructive'
      })
    }
  })
  const { data: rasxodList, isFetching } = useRasxodList({
    params: {
      main_schet_id: main_schet?.id,
      limit: 10,
      page: 1,
      from,
      to
    }
  })

  useLayout({
    title: 'Расходный документ',
    onCreate() {
      navigate('create')
    }
  })

  return (
    <>
      <div className="p-5">
        <DateRangeForm form={form} onSubmit={applyFilters} />
      </div>
      <div className="flex-1 relative">
        {isFetching ? <LoadingOverlay /> : null}
        <GenericTable
          columns={columns}
          data={rasxodList?.data ?? []}
          onEdit={(row) => navigate(`${row.id}`)}
          onDelete={(row) => {
            confirm({
              title: 'Удалить расходный документ?',
              onConfirm: () => deleteRasxod(row.id)
            })
          }}
        />
      </div>
    </>
  )
}

export { MO7RasxodPage }
