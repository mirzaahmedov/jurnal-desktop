import type { User } from '@/common/models'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminUserService } from './service'
import { GenericTable, LoadingOverlay } from '@/common/components'
import { adminUserColumns } from './columns'
import { adminUserQueryKeys } from './constants'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/features/layout'
import { useConfirm } from '@/common/features/confirm'
import AdminUserDialog from './dialog'

const UserPage = () => {
  const [selected, setSelected] = useState<User | null>(null)

  const toggle = useToggle()
  const queryClient = useQueryClient()

  const { confirm } = useConfirm()

  const { data: users, isFetching } = useQuery({
    queryKey: [adminUserQueryKeys.getAll],
    queryFn: adminUserService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [adminUserQueryKeys.delete],
    mutationFn: adminUserService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [adminUserQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!toggle.isOpen) {
      setSelected(null)
    }
  }, [toggle.isOpen])
  useLayout({
    title: 'Пользователи',
    onCreate: toggle.open
  })

  const handleClickEdit = (row: User) => {
    setSelected(row)
    toggle.open()
  }
  const handleClickDelete = (row: User) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  return (
    <>
      <div className="relative">
        {isFetching || isPending ? <LoadingOverlay /> : null}
        <GenericTable
          data={users?.data ?? []}
          columns={adminUserColumns}
          onDelete={handleClickDelete}
          onEdit={handleClickEdit}
        />
      </div>
      <AdminUserDialog
        data={selected}
        open={toggle.isOpen}
        onChangeOpen={toggle.setIsOpen}
      />
    </>
  )
}

export default UserPage
