import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { GenericTable } from '@renderer/common/components'
import { ListView } from '@renderer/common/views'
import { Mainbook } from '@renderer/common/models'
import { mainbookColumns } from './columns'
import { mainbookQueryKeys } from './config'
import { mainbookService } from './service'
import { toast } from '@renderer/common/hooks'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayout } from '@renderer/common/features/layout'
import { useMainSchet } from '@renderer/common/features/main-schet'
import { useNavigate } from 'react-router-dom'

const MainbookPage = () => {
  const main_schet = useMainSchet((store) => store.main_schet)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { confirm } = useConfirm()

  const { data: reportList, isFetching } = useQuery({
    queryKey: [mainbookQueryKeys.getAll, { budjet_id: main_schet?.budget_id }],
    queryFn: mainbookService.getAll
  })
  const { mutate: deleteReport, isPending } = useMutation({
    mutationKey: [mainbookQueryKeys.delete],
    mutationFn: mainbookService.delete,
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
        queryKey: [mainbookQueryKeys.getAll]
      })
    }
  })

  useLayout({
    title: 'Закончить месячный отчёт',
    onCreate: () => {
      navigate(`create?year=${encodeURIComponent}`)
    }
  })

  const handleEdit = (row: Mainbook.ReportPreview) => {
    navigate(`${row.id}`)
  }

  const handleDelete = (row: Mainbook.ReportPreview) => {
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
          columns={mainbookColumns}
          data={reportList?.data ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ListView.Content>
      <ListView.Footer></ListView.Footer>
    </ListView>
  )
}

export default MainbookPage
