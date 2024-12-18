import type { Unit } from '@/common/models'

import { GenericTable } from '@/common/components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { unitService } from './service'
import { unitColumns } from './columns'
import { useEffect, useState } from 'react'
import { useToggle } from '@/common/hooks/use-toggle'
import { unitQueryKeys } from './constants'
import { useLayout } from '@/common/features/layout'
import { useConfirm } from '@/common/features/confirm'

import { ListView } from '@/common/views'
import { UnitDialog } from './dialog'

const UnitPage = () => {
  const [selected, setSelected] = useState<Unit | null>(null)

  const { confirm } = useConfirm()

  const toggle = useToggle()
  const queryClient = useQueryClient()

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
    if (!toggle.isOpen) {
      setSelected(null)
    }
  }, [toggle.isOpen])
  useLayout({
    title: 'Роль',
    onCreate: toggle.open
  })

  const handleClickEdit = (row: Unit) => {
    setSelected(row)
    toggle.open()
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
          columns={unitColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <UnitDialog
        data={selected}
        open={toggle.isOpen}
        onChangeOpen={toggle.setIsOpen}
      />
    </ListView>
  )
}

export default UnitPage
