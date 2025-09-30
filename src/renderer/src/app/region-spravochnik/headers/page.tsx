import type { IHeader } from '@/common/models/headers'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { usePagination } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { PodrazdelenieColumns } from './columns'
import { HeaderDialog } from './dialog'
import { HeadersService } from './service'

const PodrazdeleniePage = () => {
  const dialogToggle = useToggle()
  const pagination = usePagination()

  const setLayout = useLayout()

  const [selected, setSelected] = useState<IHeader | null>(null)
  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])

  const headersQuery = useQuery({
    queryKey: [
      'headers/all',
      {
        ...pagination,
        search
      }
    ],
    queryFn: HeadersService.getAll
  })

  useEffect(() => {
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])

  useEffect(() => {
    setLayout({
      title: t('pages.headers'),
      breadcrumbs: [
        {
          title: t('pages.spravochnik')
        }
      ],
      content: SearchFilterDebounced,
      onCreate: dialogToggle.open
    })
  }, [setLayout, t, dialogToggle.open])

  const handleClickEdit = (row: IHeader) => {
    setSelected(row)
    dialogToggle.open()
  }

  return (
    <ListView>
      <ListView.Content isLoading={headersQuery.isFetching}>
        <GenericTable
          data={headersQuery?.data?.data ?? []}
          columnDefs={PodrazdelenieColumns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={headersQuery?.data?.meta?.count ?? 0}
          pageCount={headersQuery?.data?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <HeaderDialog
        selected={selected}
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default PodrazdeleniePage
