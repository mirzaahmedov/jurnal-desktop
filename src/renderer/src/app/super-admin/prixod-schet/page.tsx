import type { PrixodSchet } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { prixodSchetColumns } from './columns'
import { prixodSchetQueryKeys } from './config'
import { PrixodSchetDialog } from './dialog'
import { PrixodSchetService } from './service'

const PrixodSchetsPage = () => {
  const setLayout = useLayout()
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const [selected, setSelected] = useState<PrixodSchet | null>(null)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: prixodSchets, isFetching } = useQuery({
    queryKey: [prixodSchetQueryKeys.getAll],
    queryFn: PrixodSchetService.getAll
  })

  const { mutate: deletePrixodSchet, isPending: isDeletingPrixodSchets } = useMutation({
    mutationKey: [prixodSchetQueryKeys.delete],
    mutationFn: PrixodSchetService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [prixodSchetQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])
  useEffect(() => {
    setLayout({
      title: t('pages.prixod_schets'),
      onCreate: dialogToggle.open
    })
  }, [setLayout, dialogToggle.open, t])

  const handleClickEdit = (row: PrixodSchet) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: PrixodSchet) => {
    confirm({
      onConfirm() {
        deletePrixodSchet(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isDeletingPrixodSchets}>
        <GenericTable
          data={prixodSchets?.data ?? []}
          columnDefs={prixodSchetColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <PrixodSchetDialog
        selected={selected}
        open={dialogToggle.isOpen}
        onChangeOpen={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default PrixodSchetsPage
