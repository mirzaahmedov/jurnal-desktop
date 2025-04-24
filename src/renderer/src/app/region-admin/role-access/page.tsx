import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { RoleColumns, RoleQueryKeys, RoleService } from '@/app/super-admin/role'
import { GenericTable } from '@/common/components'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { usePagination } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { RoleAccessDialog } from './dialog'

const RoleAccessPage = () => {
  const [roleId, setRoleId] = useState<number | undefined>()
  const [search] = useSearchFilter()

  const setLayout = useLayout()
  const dialogToggle = useToggle()
  const pagination = usePagination()

  const { t } = useTranslation(['app'])

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

  useEffect(() => {
    setLayout({
      title: t('pages.access_rights'),
      breadcrumbs: [
        {
          title: t('pages.admin')
        }
      ],
      content: SearchFilterDebounced
    })
  }, [setLayout, t])
  useEffect(() => {
    if (!dialogToggle.isOpen) {
      setRoleId(undefined)
    }
  }, [dialogToggle.isOpen])

  return (
    <ListView>
      <ListView.Content loading={isFetching}>
        <RoleAccessDialog
          roleId={roleId}
          isOpen={dialogToggle.isOpen}
          onOpenChange={dialogToggle.setOpen}
        />
        <GenericTable
          columnDefs={RoleColumns}
          data={roles?.data ?? []}
          onEdit={(role) => {
            setRoleId(role.id)
            dialogToggle.open()
          }}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          count={roles?.meta?.count ?? 0}
          pageCount={roles?.meta?.pageCount ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default RoleAccessPage
