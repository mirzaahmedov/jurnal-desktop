import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { GenericTable } from '@renderer/common/components'
import { ListView } from '@renderer/common/views'
import { OpenMonthlyReport } from '@renderer/common/models'
import { mainbookReportColumns } from './columns'
import { mainbookReportQueryKeys } from './config'
import { mainbookReportService } from './service'
import { toast } from '@renderer/common/hooks'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayout } from '@renderer/common/features/layout'
import { useMainSchet } from '@renderer/common/features/main-schet'
import { useNavigate } from 'react-router-dom'

const MainbookReportPage = () => {
  const main_schet = useMainSchet((store) => store.main_schet)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { confirm } = useConfirm()

  const { data: reportList, isFetching } = useQuery({
    queryKey: [
      mainbookReportQueryKeys.getAll,
      {
        budjet_id: main_schet?.budget_id
      }
    ],
    queryFn: mainbookReportService.getAll,
    enabled: !!main_schet
  })
  const { mutate: deleteReport, isPending } = useMutation({
    mutationKey: [mainbookReportQueryKeys.delete],
    mutationFn: mainbookReportService.delete,
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
        queryKey: [mainbookReportQueryKeys.getAll]
      })
    }
  })

  useLayout({
    title: 'Создать месячный отчет',
    onCreate: () => {
      navigate('create')
    }
  })

  const handleEdit = (row: OpenMonthlyReport) => {
    navigate(`${row.id}`)
  }

  const handleDelete = (row: OpenMonthlyReport) => {
    confirm({
      title: 'Удалить запись?',
      onConfirm: () => {
        deleteReport(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columns={mainbookReportColumns}
          data={reportList?.data ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ListView.Content>
    </ListView>
  )
}

export default MainbookReportPage
