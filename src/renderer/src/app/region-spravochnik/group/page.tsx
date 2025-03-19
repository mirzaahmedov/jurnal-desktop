import { useEffect } from 'react'

import { groupColumns } from '@renderer/app/super-admin/group/columns'
import { groupQueryKeys } from '@renderer/app/super-admin/group/constants'
import { GroupTable, groupService } from '@renderer/app/super-admin/group/service'
import { DownloadFile } from '@renderer/common/features/file'
import { SearchField } from '@renderer/common/features/search/search-field'
import { useSearch } from '@renderer/common/features/search/use-search'
import { ListView } from '@renderer/common/views'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useLayoutStore } from '@/common/features/layout'

const RegionGroupPage = () => {
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const { search } = useSearch()

  const { data: groupList, isFetching } = useQuery({
    queryKey: [
      groupQueryKeys.getAll,
      {
        search,
        page: 1,
        limit: 10000000
      }
    ],
    queryFn: groupService.getAll
  })

  useEffect(() => {
    setLayout({
      title: t('pages.group'),
      breadcrumbs: [
        {
          title: t('pages.spravochnik')
        }
      ],
      content: SearchField
    })
  }, [setLayout])

  return (
    <ListView>
      <ListView.Header>
        <DownloadFile
          variant="default"
          url="/jur_7/group/export"
          params={{
            page: 1,
            limit: 10000000,
            excel: true
          }}
          fileName={`${t('group')}.xlsx`}
          buttonText={t('export-excel')}
        />
      </ListView.Header>
      <ListView.Content loading={isFetching}>
        <GroupTable
          columnDefs={groupColumns}
          data={groupList?.data ?? []}
        />
      </ListView.Content>
    </ListView>
  )
}

export default RegionGroupPage
