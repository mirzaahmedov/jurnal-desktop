import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GroupColumns } from '@/app/super-admin/group/columns'
import { GroupQueryKeys } from '@/app/super-admin/group/config'
import { GroupService, GroupTable } from '@/app/super-admin/group/service'
import { DownloadFile } from '@/common/features/file'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

const RegionGroupPage = () => {
  const setLayout = useLayout()

  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])

  const { data: groups, isFetching } = useQuery({
    queryKey: [
      GroupQueryKeys.getAll,
      {
        search,
        page: 1,
        limit: 10000000
      }
    ],
    queryFn: GroupService.getAll
  })

  useEffect(() => {
    setLayout({
      title: t('pages.group'),
      breadcrumbs: [
        {
          title: t('pages.spravochnik')
        }
      ],
      content: SearchFilterDebounced
    })
  }, [setLayout, t])

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
      <ListView.Content isLoading={isFetching}>
        <GroupTable
          columnDefs={GroupColumns}
          data={groups?.data ?? []}
        />
      </ListView.Content>
    </ListView>
  )
}

export default RegionGroupPage
