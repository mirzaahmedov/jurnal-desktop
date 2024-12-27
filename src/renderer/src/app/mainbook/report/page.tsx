import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { GenericTable } from '@renderer/common/components'
import { ListView } from '@renderer/common/views'
import { Mainbook } from '@renderer/common/models'
import { mainbookReportColumns } from './columns'
import { mainbookReportQueryKeys } from './config'
import { mainbookReportService } from './service'
import { toast } from '@renderer/common/hooks'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayout } from '@renderer/common/features/layout'
import { useNavigate } from 'react-router-dom'
import { useRequisitesStore } from '@renderer/common/features/main-schet'

const MainbookReportPage = () => {
  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { confirm } = useConfirm()

  const { data: reportList, isFetching } = useQuery({
    queryKey: [
      mainbookReportQueryKeys.getAll,
      {
        budjet_id
      }
    ],
    queryFn: mainbookReportService.getAll,
    enabled: !!budjet_id
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

  const handleEdit = (row: Mainbook.Report) => {
    navigate(`${row.id}`)
  }

  const handleDelete = (row: Mainbook.Report) => {
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
