import type { Unit } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { UnitColumns } from './columns'
import { UnitQueryKeys } from './config'
import { UnitDialog } from './dialog'
import { UnitService } from './service'

const UnitPage = () => {
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const [selected, setSelected] = useState<Unit | null>(null)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: unit, isFetching } = useQuery({
    queryKey: [UnitQueryKeys.getAll],
    queryFn: UnitService.getAll
  })

  const { mutate: deleteUnit, isPending } = useMutation({
    mutationKey: [UnitQueryKeys.delete],
    mutationFn: UnitService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [UnitQueryKeys.getAll]
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
        deleteUnit(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={unit?.data ?? []}
          columnDefs={UnitColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <UnitDialog
        selected={selected}
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default UnitPage
