import { GenericTable, LoadingOverlay } from '@/common/components'
import { columns, queryKeys } from './config'
import { useRasxodDelete, useRasxodList } from './service'

import { DateRangeForm } from '../common/components/date-range-form'
import { toast } from '@/common/hooks/use-toast'
import { useConfirm } from '@/common/features/confirm'
import { useJurnal7DateRange } from '../common/components/use-date-range'
import { useLayout } from '@/common/features/layout'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useRequisitesStore } from '@renderer/common/features/requisites'

const MO7RasxodPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

  const { confirm } = useConfirm()
  const { form, from, to, applyFilters } = useJurnal7DateRange()

  console.log({ from, to })

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
      main_schet_id,
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
        <DateRangeForm
          form={form}
          onSubmit={applyFilters}
        />
      </div>
      <div className="flex-1 relative">
        {isFetching ? <LoadingOverlay /> : null}
        <GenericTable
          columnDefs={columns}
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
