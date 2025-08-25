import type { Zarplata } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { queryClient } from '@/common/lib/query-client'
import { ListView } from '@/common/views'

import { getZarplataSpravochnikColumnDefs } from './columns'
import { ZarplataSpravochnikDialog } from './dialog'
import { SpravochnikFilters, useTypeFilter } from './filters'
import { ZarplataSpravochnikService } from './service'

const { QueryKeys } = ZarplataSpravochnikService

const ZarplataSpravochnikPage = () => {
  const { t } = useTranslation(['app'])

  const [selected, setSelected] = useState<Zarplata.Spravochnik>()
  const [search] = useSearchFilter()
  const [typeCode] = useTypeFilter()

  const pagination = usePagination()
  const dialogToggle = useToggle()
  const setLayout = useLayout()

  const { confirm } = useConfirm()
  const { data: spravochniks, isFetching } = useQuery({
    queryKey: [
      QueryKeys.GetAll,
      {
        types_type_code: typeCode!,
        search: search,
        page: pagination.page,
        limit: pagination.limit
      }
    ],
    queryFn: ZarplataSpravochnikService.getAll,
    enabled: !!typeCode
  })

  const { mutate: deleteSpravochnik, isPending } = useMutation({
    mutationKey: [QueryKeys.Delete],
    mutationFn: ZarplataSpravochnikService.delete,
    onSuccess: () => {
      dialogToggle.close()
      setSelected(undefined)
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GetAll]
      })
      toast.success(t('delete_success'))
    },
    onError: () => {
      toast.error(t('delete_failed'))
    }
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
  const handleDelete = (row: Zarplata.Spravochnik) => {
    confirm({
      onConfirm: () => {
        deleteSpravochnik(row.id)
      }
    })
  }

  const count = spravochniks?.meta?.count ?? 0
  const pageCount = spravochniks?.meta?.pageCount ?? 0

  return (
    <ListView>
      <ListView.Content isLoading={isFetching || isPending}>
        <GenericTable
          data={spravochniks?.data ?? []}
          columnDefs={getZarplataSpravochnikColumnDefs(typeCode!)}
          onEdit={handleEdit}
          onDelete={handleDelete}
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
