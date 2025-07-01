import type { User } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { usePagination } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { AdminUserColumns } from './columns'
import { AdminUserQueryKeys } from './config'
import { AdminUserDialog } from './dialog'
import { AdminUserService } from './service'

const UserPage = () => {
  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()

  const setLayout = useLayout()

  const [selected, setSelected] = useState<User | null>(null)
  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: users, isFetching } = useQuery({
    queryKey: [
      AdminUserQueryKeys.getAll,
      {
        ...pagination,
        search
      }
    ],
    queryFn: AdminUserService.getAll
  })
  const { mutate: deleteUser, isPending } = useMutation({
    mutationKey: [AdminUserQueryKeys.delete],
    mutationFn: AdminUserService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [AdminUserQueryKeys.getAll]
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
      content: SearchFilterDebounced,
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
        deleteUser(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content isLoading={isFetching || isPending}>
        <GenericTable
          data={users?.data ?? []}
          columnDefs={AdminUserColumns}
          onDelete={handleClickDelete}
          onEdit={handleClickEdit}
        />
      </ListView.Content>
      <AdminUserDialog
        selected={selected}
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
      <ListView.Footer>
        <ListView.Pagination
          count={users?.meta?.count ?? 0}
          pageCount={users?.meta?.pageCount ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default UserPage
