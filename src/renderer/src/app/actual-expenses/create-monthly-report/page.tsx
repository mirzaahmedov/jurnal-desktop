import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { GenericTable } from '@renderer/common/components'
import { ListView } from '@renderer/common/views'
import { OpenMonthlyReport } from '@renderer/common/models'
import { openMonthlyReportColumns } from './columns'
import { openMonthlyReportQueryKeys } from './config'
import { openMonthlyReportService } from './service'
import { toast } from '@renderer/common/hooks'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayout } from '@renderer/common/features/layout'
import { useMainSchet } from '@renderer/common/features/main-schet'
import { useNavigate } from 'react-router-dom'

const CreateMonthlyReportPage = () => {
  const main_schet = useMainSchet((store) => store.main_schet)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { confirm } = useConfirm()

  const { data: reportList, isFetching } = useQuery({
    queryKey: [
      openMonthlyReportQueryKeys.getAll,
      {
        budjet_id: main_schet?.budget_id
      }
    ],
    queryFn: openMonthlyReportService.getAll,
    enabled: !!main_schet
  })
  const { mutate: deleteReport, isPending } = useMutation({
    mutationKey: [openMonthlyReportQueryKeys.delete],
    mutationFn: openMonthlyReportService.delete,
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
        queryKey: [openMonthlyReportQueryKeys.getAll]
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
          columns={openMonthlyReportColumns}
          data={reportList?.data ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ListView.Content>
    </ListView>
  )
}

export default CreateMonthlyReportPage
