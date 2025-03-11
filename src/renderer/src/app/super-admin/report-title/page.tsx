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
import { unitQueryKeys } from './config'
import { UnitDialog } from './dialog'
import { reportTitleService } from './service'

const ReportTitlePage = () => {
  const [selected, setSelected] = useState<ReportTitle | null>(null)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const toggle = useToggle()
  const queryClient = useQueryClient()

  const { data: unit, isFetching } = useQuery({
    queryKey: [unitQueryKeys.getAll],
    queryFn: reportTitleService.getAll
  })

  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [unitQueryKeys.delete],
    mutationFn: reportTitleService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [unitQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!toggle.isOpen) {
      setSelected(null)
    }
  }, [toggle.isOpen])
  useLayout({
    title: t('pages.edin'),
    onCreate: toggle.open
  })

  const handleClickEdit = (row: ReportTitle) => {
    setSelected(row)
    toggle.open()
  }
  const handleClickDelete = (row: ReportTitle) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={unit?.data ?? []}
          columnDefs={unitColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <UnitDialog
        selected={selected}
        open={toggle.isOpen}
        onChangeOpen={toggle.setOpen}
      />
    </ListView>
  )
}

export default ReportTitlePage
