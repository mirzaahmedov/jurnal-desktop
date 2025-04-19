import type { Unit } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { unitColumns } from './columns'
import { unitQueryKeys } from './constants'
import { UnitDialog } from './dialog'
import { unitService } from './service'

const UnitPage = () => {
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const [selected, setSelected] = useState<Unit | null>(null)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: unit, isFetching } = useQuery({
    queryKey: [unitQueryKeys.getAll],
    queryFn: unitService.getAll
  })

  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [unitQueryKeys.delete],
    mutationFn: unitService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [unitQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.edin'),
      onCreate: dialogToggle.open
    })
  }, [setLayout, dialogToggle.open, t])
  useEffect(() => {
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])

  const handleClickEdit = (row: Unit) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: Unit) => {
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
        data={selected}
        open={dialogToggle.isOpen}
        onChangeOpen={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default UnitPage
