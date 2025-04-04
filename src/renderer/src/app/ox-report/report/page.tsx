import type { OX } from '@/common/models'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesStore } from '@/common/features/requisites'
import { toast } from '@/common/hooks'
import { useLayout } from '@/common/layout/store'
import { ListView } from '@/common/views'

import { oxReportColumns } from './columns'
import { oxReportQueryKeys } from './config'
import { oxReportService } from './service'

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
    mutationFn: oxReportService.delete as (params: any) => Promise<any>,
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
    navigate(`edit?date=${row.year}-${row.month}`)
  }

  const handleDelete = (row: OX.Report) => {
    confirm({
      title: 'Удалить запись?',
      onConfirm: () => {
        deleteReport({
          year: row.year,
          month: row.month
        })
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columnDefs={oxReportColumns}
          data={reportList?.data ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ListView.Content>
    </ListView>
  )
}

export default OXReportPage
