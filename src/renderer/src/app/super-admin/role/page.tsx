import type { Role } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'

import { roleColumns } from './columns'
import { roleQueryKeys } from './constants'
import RoleDialog from './dialog'
import { roleService } from './service'

const RolePage = () => {
  const [selected, setSelected] = useState<Role | null>(null)

  const { confirm } = useConfirm()

  const toggle = useToggle()
  const queryClient = useQueryClient()

  const { data: role, isFetching } = useQuery({
    queryKey: [roleQueryKeys.getAll],
    queryFn: roleService.getAll
  })

  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [roleQueryKeys.delete],
    mutationFn: roleService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [roleQueryKeys.getAll]
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

  const handleClickEdit = (row: Role) => {
    setSelected(row)
    toggle.open()
  }
  const handleClickDelete = (row: Role) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  return (
    <>
      <div className="flex-1 relative">
        {isFetching || isPending ? <LoadingOverlay /> : null}
        <GenericTable
          data={role?.data ?? []}
          columnDefs={roleColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </div>
      <RoleDialog
        data={selected}
        open={toggle.isOpen}
        onChangeOpen={toggle.setOpen}
      />
    </>
  )
}

export default RolePage
