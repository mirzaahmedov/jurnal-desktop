import type { Role } from '@/common/models'

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

import { roleColumns } from './columns'
import { roleQueryKeys } from './constants'
import RoleDialog from './dialog'
import { roleService } from './service'

const RolePage = () => {
  const [selected, setSelected] = useState<Role | null>(null)

  const { confirm } = useConfirm()
  const { search } = useSearch()
  const { t } = useTranslation(['app'])

  const pagination = usePagination()
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const setLayout = useLayoutStore((store) => store.setLayout)

  const { data: roles, isFetching } = useQuery({
    queryKey: [
      roleQueryKeys.getAll,
      {
        ...pagination,
        search
      }
    ],
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
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])
  useEffect(() => {
    setLayout({
      title: t('pages.role'),
      content: SearchField,
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
          columnDefs={roleColumns}
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
