import type { PrixodSchet } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { PrixodSchetColumns } from './columns'
import { PrixodSchetQueryKeys } from './config'
import { PrixodSchetDialog } from './dialog'
import { PrixodSchetService } from './service'

const PrixodSchetPage = () => {
  const [selected, setSelected] = useState<PrixodSchet | null>(null)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const setLayout = useLayout()
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const { data: schets, isFetching } = useQuery({
    queryKey: [PrixodSchetQueryKeys.getAll],
    queryFn: PrixodSchetService.getAll
  })

  const { mutate: deleteSchet, isPending: isDeleting } = useMutation({
    mutationKey: [PrixodSchetQueryKeys.delete],
    mutationFn: PrixodSchetService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [PrixodSchetQueryKeys.getAll]
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

  const handleClickEdit = (row: PrixodSchet) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: PrixodSchet) => {
    confirm({
      onConfirm() {
        deleteSchet(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isDeleting}>
        <GenericTable
          data={schets?.data ?? []}
          columnDefs={PrixodSchetColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <PrixodSchetDialog
        selected={selected}
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default PrixodSchetPage
