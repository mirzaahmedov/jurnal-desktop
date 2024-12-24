import { deleteCloseMonthlyReport, getCloseMonthlyReportList } from './service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { CloseMonthlyReport } from '@renderer/common/models'
import { GenericTable } from '@renderer/common/components'
import { ListView } from '@renderer/common/views'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { closeMonthlyReportColumns } from './columns'
import { closeMonthlyReportQueryKeys } from './config'
import { toast } from '@renderer/common/hooks'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayout } from '@renderer/common/features/layout'
import { useMainSchet } from '@renderer/common/features/main-schet'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const CloseMonthlyReportPage = () => {
  const [date, setDate] = useState('2024-01-01')

  const main_schet_id = useMainSchet((store) => store.main_schet?.id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { confirm } = useConfirm()

  const { data: closeMontlyReportList, isFetching } = useQuery({
    queryKey: [closeMonthlyReportQueryKeys.getAll, { main_schet_id: main_schet_id! }],
    queryFn: getCloseMonthlyReportList
  })
  const { mutate, isPending } = useMutation({
    mutationFn: deleteCloseMonthlyReport,
    onError: (error) => {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при удалении записи'
      })
    },
    onSuccess: () => {
      toast({
        title: 'Запись успешно удалена'
      })
      queryClient.invalidateQueries({
        queryKey: [closeMonthlyReportQueryKeys.getAll]
      })
    }
  })

  useLayout({
    title: 'Закончить месячный отчёт',
    onCreate: () => {
      navigate('all/create')
    }
  })

  const handleEdit = (row: CloseMonthlyReport) => {
    navigate(`${row.year}/${row.month}`)
  }

  const handleDelete = (row: CloseMonthlyReport) => {
    confirm({
      title: 'Удалить запись?',
      onConfirm: async () => {
        if (!main_schet_id) return
        mutate({
          main_schet_id: main_schet_id!,
          year: row.year,
          month: row.month
        })
      }
    })
  }

  return (
    <ListView>
      <ListView.Header>
        <MonthPicker
          value={date}
          onChange={setDate}
        />
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columns={closeMonthlyReportColumns}
          data={closeMontlyReportList?.data ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ListView.Content>
      <ListView.Footer></ListView.Footer>
    </ListView>
  )
}

export default CloseMonthlyReportPage
