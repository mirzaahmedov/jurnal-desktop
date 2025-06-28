import type { Zarplata } from '@/common/models'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { columnDefs } from './columns'
import { ZarplataSpravochnikDialog } from './dialog'
import { SpravochnikFilters, useTypeFilter } from './filters'
import { ZarplataSpravochnikService } from './service'

const { queryKeys } = ZarplataSpravochnikService

const ZarplataSpravochnikPage = () => {
  const { t } = useTranslation(['app'])

  const [selected, setSelected] = useState<Zarplata.Spravochnik>()
  const [search] = useSearchFilter()
  const [typeCode] = useTypeFilter()

  const pagination = usePagination()
  const dialogToggle = useToggle()
  const setLayout = useLayout()

  const { data: spravochniks, isFetching } = useQuery({
    queryKey: [
      queryKeys.getAll,
      {
        types_type_code: typeCode!,
        name: search
      }
    ],
    queryFn: ZarplataSpravochnikService.getAll,
    enabled: !!typeCode
  })

  useEffect(() => {
    setLayout({
      title: t('pages.zarplata'),
      onCreate() {
        dialogToggle.open()
        setSelected(undefined)
      },
      content: SpravochnikFilters
    })
  }, [setLayout, t, dialogToggle.open])

  const handleEdit = (row: Zarplata.Spravochnik) => {
    dialogToggle.open()
    setSelected(row)
  }

  const count = spravochniks?.totalCount ?? 0
  const pageCount = Math.ceil(count / pagination.limit)

  return (
    <ListView>
      <ListView.Content loading={isFetching}>
        <GenericTable
          data={spravochniks?.data ?? []}
          columnDefs={columnDefs}
          onEdit={handleEdit}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={pageCount}
          count={count}
        />
      </ListView.Footer>
      <ZarplataSpravochnikDialog
        selected={selected}
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default ZarplataSpravochnikPage
