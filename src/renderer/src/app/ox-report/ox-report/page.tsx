import type { OX } from '@/common/models'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesStore } from '@/common/features/requisites'
import { toast } from '@/common/hooks'
import { useLayout } from '@/common/layout/store'
import { ListView } from '@/common/views'

import { oxColumns } from './columns'
import { oxQueryKeys } from './config'
import { oxService } from './service'

const OXPage = () => {
  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { confirm } = useConfirm()

  const { data: reportList, isFetching } = useQuery({
    queryKey: [
      oxQueryKeys.getAll,
      {
        budjet_id
      }
    ],
    queryFn: oxService.getAll,
    enabled: !!budjet_id
  })
  const { mutate: deleteReport, isPending } = useMutation({
    mutationKey: [oxQueryKeys.delete],
    mutationFn: oxService.delete as (params: any) => Promise<any>,
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
        queryKey: [oxQueryKeys.getAll]
      })
    }
  })

  useLayout({
    title: 'Закончить месячный отчёт',
    onCreate: () => {
      navigate(`create`)
    }
  })

  const handleEdit = (row: OX.ReportPreview) => {
    navigate(`edit?date=${row.year}-${row.month}`)
  }

  const handleDelete = (row: OX.ReportPreview) => {
    confirm({
      title: 'Удалить запись?',
      onConfirm: async () => {
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
          columnDefs={oxColumns}
          data={reportList?.data ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ListView.Content>
      <ListView.Footer></ListView.Footer>
    </ListView>
  )
}

export default OXPage
