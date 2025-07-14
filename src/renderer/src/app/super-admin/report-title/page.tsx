import type { ReportTitle } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { usePagination } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { ReportTitleColumns } from './columns'
import { ReportTitleQueryKeys } from './config'
import { ReportTitleDialog } from './dialog'
import { ReportTitleService } from './service'

const ReportTitlePage = () => {
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const setLayout = useLayout()
  const pagination = usePagination()

  const [selected, setSelected] = useState<ReportTitle | null>(null)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: titles, isFetching } = useQuery({
    queryKey: [
      ReportTitleQueryKeys.getAll,
      {
        page: pagination.page,
        limit: pagination.limit
      }
    ],
    queryFn: ReportTitleService.getAll
  })

  const { mutate: deleteTitle, isPending } = useMutation({
    mutationKey: [ReportTitleQueryKeys.delete],
    mutationFn: ReportTitleService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [ReportTitleQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.report_title'),
      onCreate: dialogToggle.open
    })
  }, [setLayout, dialogToggle.open, t])
  useEffect(() => {
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])

  const handleClickEdit = (row: ReportTitle) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: ReportTitle) => {
    confirm({
      onConfirm() {
        deleteTitle(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content isLoading={isFetching || isPending}>
        <GenericTable
          data={titles?.data ?? []}
          columnDefs={ReportTitleColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ReportTitleDialog
        selected={selected}
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={titles?.meta?.pageCount ?? 0}
          count={titles?.meta?.count ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default ReportTitlePage
