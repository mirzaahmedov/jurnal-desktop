import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { CreateMonthlyReport } from '@renderer/common/models'
import { GenericTable } from '@renderer/common/components'
import { ListView } from '@renderer/common/views'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { createMonthlyReportColumns } from './columns'
import { createMonthlyReportQueryKeys } from './config'
import { createMonthlyReportService } from './service'
import { toast } from '@renderer/common/hooks'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayout } from '@renderer/common/features/layout'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const CreateMonthlyReportPage = () => {
  const [date, setDate] = useState('2024-01-01')

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { confirm } = useConfirm()

  const { data: createMontlyReportList, isFetching } = useQuery({
    queryKey: [createMonthlyReportQueryKeys.getAll],
    queryFn: () => createMonthlyReportService.getAll()
  })
  const { mutate: deleteCreateMonthlyReport, isPending } = useMutation({
    mutationFn: (id: number) => createMonthlyReportService.delete(id),
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
        queryKey: [createMonthlyReportQueryKeys.getAll]
      })
    }
  })

  useLayout({
    title: 'Создать месячный отчет',
    onCreate: () => {
      navigate('create')
    }
  })

  const handleEdit = (row: CreateMonthlyReport) => {
    navigate(`${row.id}`)
  }

  const handleDelete = (row: CreateMonthlyReport) => {
    confirm({
      title: 'Удалить запись?',
      onConfirm: async () => {
        deleteCreateMonthlyReport(row.id)
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
          columns={createMonthlyReportColumns}
          data={createMontlyReportList?.data ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ListView.Content>
      <ListView.Footer></ListView.Footer>
    </ListView>
  )
}

export default CreateMonthlyReportPage
