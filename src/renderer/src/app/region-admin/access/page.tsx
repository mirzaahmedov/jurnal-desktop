import { useEffect, useState } from 'react'

import { roleColumns, roleQueryKeys, roleService } from '@renderer/app/super-admin/role'
import { SearchField } from '@renderer/common/features/search/search-field'
import { useSearch } from '@renderer/common/features/search/use-search'
import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useLayoutStore } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'

import { AccessDialog } from './dialog'

const AccessPage = () => {
  const [roleId, setRoleId] = useState<number | undefined>()

  const setLayout = useLayoutStore((store) => store.setLayout)
  const dialogToggle = useToggle()
  const pagination = usePagination()

  const { search } = useSearch()
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
      content: SearchField
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
