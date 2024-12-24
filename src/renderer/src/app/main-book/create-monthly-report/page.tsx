import { createMonthlyReportDeleteQuery, createMonthlyReportGetAllQuery } from './service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { CreateMonthlyReport } from '@renderer/common/models'
import { GenericTable } from '@renderer/common/components'
import { ListView } from '@renderer/common/views'
import { createMonthlyReportColumns } from './columns'
import { createMonthlyReportQueryKeys } from './config'
import { toast } from '@renderer/common/hooks'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayout } from '@renderer/common/features/layout'
import { useMainSchet } from '@renderer/common/features/main-schet'
import { useNavigate } from 'react-router-dom'

const CreateMonthlyReportPage = () => {
  const main_schet_id = useMainSchet((store) => store.main_schet?.id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { confirm } = useConfirm()

  const { data: createMontlyReportList, isFetching } = useQuery({
    queryKey: [
      createMonthlyReportQueryKeys.getAll,
      {
        main_schet_id: main_schet_id!
      }
    ],
    queryFn: createMonthlyReportGetAllQuery
  })
  const { mutate: deleteCreateMonthlyReport, isPending } = useMutation({
    mutationKey: [createMonthlyReportQueryKeys.delete],
    mutationFn: createMonthlyReportDeleteQuery,
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
      const date = new Date().toISOString().slice(0, 7)
      const [year, month] = date.split('-')
      navigate(`${year}/${month}/create`)
    }
  })

  const handleEdit = (row: CreateMonthlyReport) => {
    navigate(`${row.year}/${row.month}/${row.type_document}`)
  }

  const handleDelete = (row: CreateMonthlyReport) => {
    confirm({
      title: 'Удалить запись?',
      onConfirm: async () => {
        // @ts-ignore - fix this
        deleteCreateMonthlyReport({
          type_document: row.type_document,
          year: row.year,
          month: row.month,
          main_schet_id: main_schet_id!
        })
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columns={createMonthlyReportColumns}
          data={createMontlyReportList?.data ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          getRowId={(row) => row.month + row.year + row.type_document}
        />
      </ListView.Content>
    </ListView>
  )
}

export default CreateMonthlyReportPage
