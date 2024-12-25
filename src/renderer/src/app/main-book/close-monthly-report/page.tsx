import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { CompleteMonthlyReport } from '@renderer/common/models'
import { GenericTable } from '@renderer/common/components'
import { ListView } from '@renderer/common/views'
import { completeMonthlyReportColumns } from './columns'
import { completeMonthlyReportQueryKeys } from './config'
import { completeMonthlyReportService } from './service'
import { toast } from '@renderer/common/hooks'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayout } from '@renderer/common/features/layout'
import { useMainSchet } from '@renderer/common/features/main-schet'
import { useNavigate } from 'react-router-dom'

const CompleteMonthlyReportPage = () => {
  const main_schet = useMainSchet((store) => store.main_schet)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { confirm } = useConfirm()

  const { data: reportList, isFetching } = useQuery({
    queryKey: [completeMonthlyReportQueryKeys.getAll, { budjet_id: main_schet?.budget_id }],
    queryFn: completeMonthlyReportService.getAll
  })
  const { mutate: deleteReport, isPending } = useMutation({
    mutationKey: [completeMonthlyReportQueryKeys.delete],
    mutationFn: completeMonthlyReportService.delete,
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
        queryKey: [completeMonthlyReportQueryKeys.getAll]
      })
    }
  })

  useLayout({
    title: 'Закончить месячный отчёт',
    onCreate: () => {
      navigate(`create?year=${encodeURIComponent}`)
    }
  })

  const handleEdit = (row: CompleteMonthlyReport) => {
    navigate(`${row.id}`)
  }

  const handleDelete = (row: CompleteMonthlyReport) => {
    confirm({
      title: 'Удалить запись?',
      onConfirm: async () => {
        deleteReport(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columns={completeMonthlyReportColumns}
          data={reportList?.data ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ListView.Content>
      <ListView.Footer></ListView.Footer>
    </ListView>
  )
}

export default CompleteMonthlyReportPage
