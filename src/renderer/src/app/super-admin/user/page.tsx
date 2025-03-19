import type { User } from '@/common/models'

import { useEffect, useState } from 'react'

import { SearchField } from '@renderer/common/features/search/search-field'
import { useSearch } from '@renderer/common/features/search/use-search'
import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'

import { adminUserColumns } from './columns'
import { adminUserQueryKeys } from './constants'
import AdminUserDialog from './dialog'
import { adminUserService } from './service'

const UserPage = () => {
  const [selected, setSelected] = useState<User | null>(null)

  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()

  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { search } = useSearch()

  const { data: users, isFetching } = useQuery({
    queryKey: [
      adminUserQueryKeys.getAll,
      {
        ...pagination,
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
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])
  useEffect(() => {
    setLayout({
      title: t('pages.user'),
      content: SearchField,
      breadcrumbs: [
        {
          title: t('pages.admin')
        }
      ],
      onCreate: dialogToggle.open
    })
  }, [setLayout, t, dialogToggle.open])

  const handleClickEdit = (row: User) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: User) => {
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
          data={users?.data ?? []}
          columnDefs={adminUserColumns}
          onDelete={handleClickDelete}
          onEdit={handleClickEdit}
        />
      </ListView.Content>
      <AdminUserDialog
        data={selected}
        open={dialogToggle.isOpen}
        onChangeOpen={dialogToggle.setOpen}
      />
      <ListView.Footer>
        <ListView.Pagination
          pageCount={users?.meta?.pageCount ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default UserPage
