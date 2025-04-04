import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { groupColumns } from '@/app/super-admin/group/columns'
import { groupQueryKeys } from '@/app/super-admin/group/constants'
import { GroupTable, groupService } from '@/app/super-admin/group/service'
import { DownloadFile } from '@/common/features/file'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { useLayoutStore } from '@/common/layout/store'
import { ListView } from '@/common/views'

const RegionGroupPage = () => {
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const [search] = useSearchFilter()

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
      content: SearchFilterDebounced
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
