import type { RealExpenses } from '@/common/models'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesStore } from '@/common/features/requisites'
import { toast } from '@/common/hooks'
import { useLayout } from '@/common/layout/store'
import { serializeDateParams } from '@/common/lib/query-params'
import { ListView } from '@/common/views'

import { expensesColumns } from './columns'
import { expensesQueryKeys } from './config'
import { realExpensesService } from './service'

const ExpensesPage = () => {
  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { confirm } = useConfirm()

  const { data: reportList, isFetching } = useQuery({
    queryKey: [
      expensesQueryKeys.getAll,
      {
        budjet_id
      }
    ],
    queryFn: realExpensesService.getAll,
    enabled: !!budjet_id
  })
  const { mutate: deleteReport, isPending } = useMutation({
    mutationKey: [expensesQueryKeys.delete],
    mutationFn: realExpensesService.delete as (params: any) => Promise<any>,
    onError: (error) => {
      console.error(error)
      toast({
        variant: 'destructive',
        title: error.message
      })
    },
    onSuccess: () => {
      toast({
        title: 'Запись успешно удалена'
      })
      queryClient.invalidateQueries({
        queryKey: [expensesQueryKeys.getAll]
      })
    }
  })

  useLayout({
    title: 'Закончить месячный отчёт',
    onCreate: () => {
      navigate(`create`)
    }
  })

  const handleEdit = (row: RealExpenses.ReportPreview) => {
    const date = serializeDateParams({
      month: row.month,
      year: row.year
    })
    navigate(`edit?date=${date}`)
  }

  const handleDelete = (row: RealExpenses.ReportPreview) => {
    confirm({
      title: 'Удалить запись?',
      onConfirm: async () => {
        deleteReport({
          month: row.month,
          year: row.year,
          budjet_id
        })
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columnDefs={expensesColumns}
          data={reportList?.data ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ListView.Content>
      <ListView.Footer></ListView.Footer>
    </ListView>
  )
}

export default ExpensesPage
