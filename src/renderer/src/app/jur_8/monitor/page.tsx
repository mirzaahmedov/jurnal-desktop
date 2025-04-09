import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useRequisitesStore } from '@/common/features/requisites'
import { usePagination } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { ListView } from '@/common/views'

import { Jur8MonitorColumns } from './columns'
import { Jur8MonitorQueryKeys } from './config'
import { Jur8MonitorService } from './service'

const Jur8MonitorPage = () => {
  const { t } = useTranslation(['app'])

  const pagination = usePagination()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { data: monitoring, isFetching } = useQuery({
    queryKey: [
      Jur8MonitorQueryKeys.getAll,
      {
        ...pagination,
        budjet_id
      }
    ],
    queryFn: Jur8MonitorService.getAll
  })

  useEffect(() => {
    setLayout({
      title: t('pages.monitoring'),
      breadcrumbs: [
        {
          title: t('pages.jur_8')
        }
      ]
    })
  }, [setLayout, t])

  return (
    <ListView>
      <ListView.Content loading={isFetching}>
        <GenericTable
          columnDefs={Jur8MonitorColumns}
          data={monitoring?.data ?? []}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={monitoring?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default Jur8MonitorPage
