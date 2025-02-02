import { GenericTable } from '@renderer/common/components'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayout } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { toast } from '@renderer/common/hooks'
import { serializeDateParams } from '@renderer/common/lib/query-params'
import { RealExpenses } from '@renderer/common/models'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { expensesReportColumns } from './columns'
import { realExpensesReportQueryKeys } from './config'
import { realExpensesReportService } from './service'

const RealExpensesReportPage = () => {
  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { confirm } = useConfirm()

  const { data: reportList, isFetching } = useQuery({
    queryKey: [
      realExpensesReportQueryKeys.getAll,
      {
        budjet_id
      }
    ],
    queryFn: realExpensesReportService.getAll,
    enabled: !!budjet_id
  })
  const { mutate: deleteReport, isPending } = useMutation({
    mutationKey: [realExpensesReportQueryKeys.delete],
    mutationFn: realExpensesReportService.delete as (params: any) => Promise<any>,
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
        queryKey: [realExpensesReportQueryKeys.getAll]
      })
    }
  })

  useLayout({
    title: 'Создать месячный отчет',
    onCreate: () => {
      navigate('create')
    }
  })

  const handleEdit = (row: RealExpenses.Report) => {
    const date = serializeDateParams({ month: row.month, year: row.year })
    navigate(`edit?date=${date}&type_document=${row.type_document}`)
  }

  const handleDelete = (row: RealExpenses.Report) => {
    confirm({
      title: 'Удалить запись?',
      onConfirm: () => {
        deleteReport({
          month: row.month,
          year: row.year,
          type_document: row.type_document,
          budjet_id
        })
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columnDefs={expensesReportColumns}
          data={reportList?.data ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ListView.Content>
    </ListView>
  )
}

export default RealExpensesReportPage
