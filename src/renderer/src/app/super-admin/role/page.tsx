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
import { RoleQueryKeys } from './constants'
import RoleDialog from './dialog'
import { RoleService } from './service'

const RolePage = () => {
  const [selected, setSelected] = useState<Role | null>(null)

  const { confirm } = useConfirm()
  const [search] = useSearchFilter()
  const { t } = useTranslation(['app'])

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

  const { mutate: deleteMutation, isPending } = useMutation({
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
  }, [setLayout])

  const handleClickEdit = (row: Role) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: Role) => {
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
          data={roles?.data ?? []}
          columnDefs={RoleColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          pageCount={roles?.meta?.pageCount ?? 0}
          {...pagination}
        />
      </ListView.Footer>
      <RoleDialog
        data={selected}
        open={dialogToggle.isOpen}
        onChangeOpen={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default RolePage
