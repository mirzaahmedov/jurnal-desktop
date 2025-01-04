import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { GenericTable } from '@renderer/common/components'
import { ListView } from '@renderer/common/views'
import type { OX } from '@renderer/common/models'
import { oxReportColumns } from './columns'
import { oxReportQueryKeys } from './config'
import { oxReportService } from './service'
import { toast } from '@renderer/common/hooks'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayout } from '@renderer/common/features/layout'
import { useNavigate } from 'react-router-dom'
import { useRequisitesStore } from '@renderer/common/features/requisites'

const OXReportPage = () => {
  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { confirm } = useConfirm()

  const { data: reportList, isFetching } = useQuery({
    queryKey: [
      oxReportQueryKeys.getAll,
      {
        budjet_id
      }
    ],
    queryFn: oxReportService.getAll,
    enabled: !!budjet_id
  })
  const { mutate: deleteReport, isPending } = useMutation({
    mutationKey: [oxReportQueryKeys.delete],
    mutationFn: oxReportService.delete,
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
        queryKey: [oxReportQueryKeys.getAll]
      })
    }
  })

  useLayout({
    title: 'Создать месячный отчет',
    onCreate: () => {
      navigate('create')
    }
  })

  const handleEdit = (row: OX.Report) => {
    navigate(`${row.id}`)
  }

  const handleDelete = (row: OX.Report) => {
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
          columns={oxReportColumns}
          data={reportList?.data ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ListView.Content>
    </ListView>
  )
}

export default OXReportPage
