import { DateRangeForm, GenericTable, LoadingOverlay } from '@/common/components'
import { useLayout } from '@/common/features/layout'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { usePrixodDelete, usePrixodList } from './service'
import { useDateRange } from '@/common/hooks/use-date-range'

import { columns, queryKeys } from './config'
import { toast } from '@/common/hooks/use-toast'
import { useConfirm } from '@/common/features/confirm'
import { useMainSchet } from '@/common/features/main-schet'

const MO7PrixodPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { main_schet } = useMainSchet()
  const { confirm } = useConfirm()
  const { form, from, to, applyFilters } = useDateRange()

  const { mutate: deletePrixod } = usePrixodDelete({
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      toast({
        title: 'Приход успешно удален'
      })
    },
    onError() {
      toast({
        title: 'Ошибка при удалении прихода',
        variant: 'destructive'
      })
    }
  })
  const { data: prixodList, isFetching } = usePrixodList({
    params: {
      main_schet_id: main_schet?.id,
      limit: 10,
      page: 1,
      from,
      to
    }
  })

  useLayout({
    title: 'Приход',
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
          data={prixodList?.data ?? []}
          onEdit={(row) => navigate(`${row.id}`)}
          onDelete={(row) => {
            confirm({
              title: 'Удалить приход?',
              onConfirm: () => deletePrixod(row.id)
            })
          }}
        />
      </div>
    </>
  )
}

export { MO7PrixodPage }
