import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { roleColumns, roleQueryKeys, roleService } from '@/app/super-admin/role'
import { GenericTable } from '@/common/components'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { usePagination } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayoutStore } from '@/common/layout/store'
import { ListView } from '@/common/views'

import { AccessDialog } from './dialog'

const AccessPage = () => {
  const [roleId, setRoleId] = useState<number | undefined>()

  const setLayout = useLayoutStore((store) => store.setLayout)
  const dialogToggle = useToggle()
  const pagination = usePagination()

  const [search] = useSearchFilter()
  const { t } = useTranslation(['app'])

  const { data: roleList, isFetching } = useQuery({
    queryKey: [
      roleQueryKeys.getAll,
      {
        ...pagination,
        search
      }
    ],
    queryFn: roleService.getAll
  })

  useEffect(() => {
    setLayout({
      title: t('pages.access'),
      breadcrumbs: [
        {
          title: t('pages.admin')
        }
      ],
      content: SearchFilterDebounced
    })
  }, [setLayout])
  useEffect(() => {
    if (!dialogToggle.isOpen) {
      setRoleId(undefined)
    }
  }, [dialogToggle.isOpen, setRoleId])

  return (
    <ListView>
      <ListView.Content loading={isFetching}>
        <AccessDialog
          roleId={roleId}
          open={dialogToggle.isOpen}
          onOpenChange={dialogToggle.setOpen}
        />
        <GenericTable
          columnDefs={roleColumns}
          data={roleList?.data ?? []}
          onEdit={(role) => {
            setRoleId(role.id)
            dialogToggle.open()
          }}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          pageCount={roleList?.meta?.pageCount ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default AccessPage
