import type { ReportTitle } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'
import { ListView } from '@/common/views'

import { unitColumns } from './columns'
import { reportTitleQueryKeys } from './config'
import { UnitDialog } from './dialog'
import { reportTitleService } from './service'

const ReportTitlePage = () => {
  const [selected, setSelected] = useState<ReportTitle | null>(null)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const { data: reportTitles, isFetching } = useQuery({
    queryKey: [reportTitleQueryKeys.getAll],
    queryFn: reportTitleService.getAll
  })

  const { mutate: deleteReportTitle, isPending } = useMutation({
    mutationKey: [reportTitleQueryKeys.delete],
    mutationFn: reportTitleService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [reportTitleQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])
  useLayout({
    title: t('pages.report-title'),
    onCreate: dialogToggle.open
  })

  const handleClickEdit = (row: ReportTitle) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: ReportTitle) => {
    confirm({
      onConfirm() {
        deleteReportTitle(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={reportTitles?.data ?? []}
          columnDefs={unitColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <UnitDialog
        selected={selected}
        open={dialogToggle.isOpen}
        onChangeOpen={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default ReportTitlePage
