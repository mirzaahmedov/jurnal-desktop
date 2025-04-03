import type { KassaOstatok } from '@/common/models'

import { useEffect } from 'react'

import { SearchFilterDebounced } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { formatNumber } from '@renderer/common/lib/format'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FooterCell, FooterRow, GenericTable, SummaTotal, useTableSort } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { useDates, usePagination } from '@/common/hooks'
import { ListView } from '@/common/views'

import { kassaOstatokColumns } from './columns'
import { kassaOstatokQueryKeys } from './config'
import { kassaOstatokService } from './service'

const KassaOstatokPage = () => {
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

  const { data: kassaOstatokList, isFetching } = useQuery({
    queryKey: [
      kassaOstatokQueryKeys.getAll,
      {
        main_schet_id,
        search,
        ...sorting,
        ...dates,
        ...pagination
      }
    ],
    queryFn: kassaOstatokService.getAll
  })
  const { mutate: deleteOstatok, isPending } = useMutation({
    mutationKey: [kassaOstatokQueryKeys.delete],
    mutationFn: kassaOstatokService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [kassaOstatokQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: KassaOstatok) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: KassaOstatok) => {
    confirm({
      onConfirm() {
        deleteOstatok(row.id)
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
            value={formatNumber(kassaOstatokList?.meta?.from_summa ?? 0)}
          />
          <SummaTotal.Value
            name={t('debet')}
            value={formatNumber(kassaOstatokList?.meta?.from_summa_prixod ?? 0)}
          />
          <SummaTotal.Value
            name={t('kredit')}
            value={formatNumber(kassaOstatokList?.meta?.from_summa_rasxod ?? 0)}
          />
        </SummaTotal>
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={kassaOstatokList?.data ?? []}
          columnDefs={kassaOstatokColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
          footer={
            <FooterRow>
              <FooterCell
                title={t('total')}
                colSpan={4}
                content={formatNumber(kassaOstatokList?.meta?.page_prixod_summa ?? 0)}
              />
              <FooterCell
                title={undefined}
                content={formatNumber(kassaOstatokList?.meta?.page_rasxod_summa ?? 0)}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <SummaTotal className="mb-5">
          <SummaTotal.Value
            name={t('remainder-to')}
            value={formatNumber(kassaOstatokList?.meta?.to_summa ?? 0)}
          />
          <SummaTotal.Value
            name={t('debet')}
            value={formatNumber(kassaOstatokList?.meta?.to_summa_prixod ?? 0)}
          />
          <SummaTotal.Value
            name={t('kredit')}
            value={formatNumber(kassaOstatokList?.meta?.to_summa_rasxod ?? 0)}
          />
        </SummaTotal>
        <ListView.Pagination
          {...pagination}
          pageCount={kassaOstatokList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default KassaOstatokPage
