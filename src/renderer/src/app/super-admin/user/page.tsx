import type { User } from '@/common/models'

import { useEffect, useState } from 'react'

import { SearchField, useSearch } from '@renderer/common/features/search'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'

import { adminUserColumns } from './columns'
import { adminUserQueryKeys } from './constants'
import AdminUserDialog from './dialog'
import { adminUserService } from './service'

const UserPage = () => {
  const [selected, setSelected] = useState<User | null>(null)

  const toggle = useToggle()
  const queryClient = useQueryClient()

  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { search } = useSearch()

  const { data: users, isFetching } = useQuery({
    queryKey: [
      adminUserQueryKeys.getAll,
      {
        search
      }
    ],
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
  useEffect(() => {
    setLayout({
      title: t('pages.user'),
      content: SearchField,
      breadcrumbs: [
        {
          title: t('pages.admin')
        }
      ],
      onCreate: toggle.open
    })
  }, [setLayout, t, toggle.open])

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
          columnDefs={adminUserColumns}
          onDelete={handleClickDelete}
          onEdit={handleClickEdit}
        />
      </div>
      <AdminUserDialog
        data={selected}
        open={toggle.isOpen}
        onChangeOpen={toggle.setOpen}
      />
    </>
  )
}

export default UserPage
