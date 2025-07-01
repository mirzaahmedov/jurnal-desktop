import type { Role } from '@/common/models'

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

import { RoleColumns } from './columns'
import { RoleQueryKeys } from './config'
import { RoleDialog } from './dialog'
import { RoleService } from './service'

const RolePage = () => {
  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

  const [selected, setSelected] = useState<Role | null>(null)
  const [search] = useSearchFilter()

  const pagination = usePagination()
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const setLayout = useLayout()

  const { data: roles, isFetching } = useQuery({
    queryKey: [
      RoleQueryKeys.getAll,
      {
        ...pagination,
        search
      }
    ],
    queryFn: RoleService.getAll
  })

  const { mutate: deleteRole, isPending } = useMutation({
    mutationKey: [RoleQueryKeys.delete],
    mutationFn: RoleService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [RoleQueryKeys.getAll]
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
      title: t('pages.role'),
      content: SearchFilterDebounced,
      onCreate: dialogToggle.open
    })
  }, [setLayout, t])

  const handleClickEdit = (row: Role) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: Role) => {
    confirm({
      onConfirm() {
        deleteRole(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content isLoading={isFetching || isPending}>
        <GenericTable
          data={roles?.data ?? []}
          columnDefs={RoleColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          count={roles?.meta?.count ?? 0}
          pageCount={roles?.meta?.pageCount ?? 0}
          {...pagination}
        />
      </ListView.Footer>
      <RoleDialog
        selected={selected}
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default RolePage
