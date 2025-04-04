import type { OrganizationOstatok } from '@/common/models'

import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FooterCell, FooterRow, GenericTable, SummaTotal, useTableSort } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { useDates, usePagination } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { organOstatokColumns } from './columns'
import { organOstatokQueryKeys } from './config'
import { organizationOstatokService } from './service'

const OrganizationOstatokPage = () => {
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const dates = useDates()

  const [search] = useSearchFilter()

  const { confirm } = useConfirm()
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { t } = useTranslation(['app'])

  const { data: organOstatokList, isFetching } = useQuery({
    queryKey: [
      organOstatokQueryKeys.getAll,
      {
        main_schet_id,
        search,
        ...sorting,
        ...dates,
        ...pagination
      }
    ],
    queryFn: organizationOstatokService.getAll
  })
  const { mutate: deleteOrganOstatok, isPending: isDeletingOrganOstatok } = useMutation({
    mutationKey: [organOstatokQueryKeys.delete],
    mutationFn: organizationOstatokService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [organOstatokQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: OrganizationOstatok) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: OrganizationOstatok) => {
    confirm({
      onConfirm() {
        deleteOrganOstatok(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.ostatok'),
      breadcrumbs: [
        {
          title: t('pages.organization')
        }
      ],
      content: SearchFilterDebounced,
      onCreate: () => {
        navigate('create')
      }
    })
  }, [setLayout, t, navigate])

  return (
    <ListView>
      <ListView.Header>
        <ListView.RangeDatePicker {...dates} />
        <SummaTotal className="mt-5">
          <SummaTotal.Value
            name={t('remainder-from')}
            value={formatNumber(organOstatokList?.meta?.from_summa ?? 0)}
          />
          <SummaTotal.Value
            name={t('debet')}
            value={formatNumber(organOstatokList?.meta?.from_summa_prixod ?? 0)}
          />
          <SummaTotal.Value
            name={t('kredit')}
            value={formatNumber(organOstatokList?.meta?.from_summa_rasxod ?? 0)}
          />
        </SummaTotal>
      </ListView.Header>
      <ListView.Content loading={isFetching || isDeletingOrganOstatok}>
        <GenericTable
          data={organOstatokList?.data ?? []}
          columnDefs={organOstatokColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
          footer={
            <FooterRow>
              <FooterCell
                title={t('total')}
                colSpan={5}
                content={formatNumber(organOstatokList?.meta?.page_prixod_summa ?? 0)}
              />
              <FooterCell
                title={undefined}
                content={formatNumber(organOstatokList?.meta?.page_rasxod_summa ?? 0)}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <SummaTotal className="mb-5">
          <SummaTotal.Value
            name={t('remainder-to')}
            value={formatNumber(organOstatokList?.meta?.to_summa ?? 0)}
          />
          <SummaTotal.Value
            name={t('debet')}
            value={formatNumber(organOstatokList?.meta?.to_summa_prixod ?? 0)}
          />
          <SummaTotal.Value
            name={t('kredit')}
            value={formatNumber(organOstatokList?.meta?.to_summa_rasxod ?? 0)}
          />
        </SummaTotal>
        <ListView.Pagination
          {...pagination}
          pageCount={organOstatokList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default OrganizationOstatokPage
