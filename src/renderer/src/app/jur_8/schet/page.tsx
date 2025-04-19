import type { JUR8Schet } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { prixodSchetColumns } from './columns'
import { JUR8SchetsQueryKeys } from './config'
import { JUR8SchetsDialog } from './dialog'
import { JUR8SchetService } from './service'

const JUR8SchetsPage = () => {
  const [selected, setSelected] = useState<JUR8Schet | null>(null)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const setLayout = useLayout()
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const { data: schets, isFetching } = useQuery({
    queryKey: [JUR8SchetsQueryKeys.getAll],
    queryFn: JUR8SchetService.getAll
  })

  const { mutate: deleteSchet, isPending: isDeletingPrixodSchets } = useMutation({
    mutationKey: [JUR8SchetsQueryKeys.delete],
    mutationFn: JUR8SchetService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [JUR8SchetsQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.schets'),
      onCreate: dialogToggle.open
    })
  }, [setLayout, dialogToggle.open, t])
  useEffect(() => {
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])

  const handleClickEdit = (row: JUR8Schet) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: JUR8Schet) => {
    confirm({
      onConfirm() {
        deleteSchet(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isDeletingPrixodSchets}>
        <GenericTable
          data={schets?.data ?? []}
          columnDefs={prixodSchetColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <JUR8SchetsDialog
        selected={selected}
        open={dialogToggle.isOpen}
        onChangeOpen={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default JUR8SchetsPage
