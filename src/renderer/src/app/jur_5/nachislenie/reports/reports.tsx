import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { CollapsibleTable } from '@/common/components/collapsible-table'
import { Button } from '@/common/components/jolly/button'
import { ListView } from '@/common/views'

import { ReportColumnDefs } from './columns'
import { getMockingReports } from './mocking'

export const Reports = () => {
  const { t } = useTranslation(['app'])

  const { data: items, isFetching } = useQuery({
    queryKey: [],
    queryFn: () => Promise.resolve(getMockingReports())
  })

  return (
    <ListView>
      <ListView.Header>
        <Button>{t('summarized_report')}</Button>
      </ListView.Header>
      <ListView.Content isLoading={isFetching}>
        <CollapsibleTable
          data={items ?? []}
          columnDefs={ReportColumnDefs}
          getChildRows={(row) => row.children}
          getRowId={(row) => row.id}
          className="table-generic-xs"
        />
      </ListView.Content>
    </ListView>
  )
}
