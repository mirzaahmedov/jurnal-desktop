import type { PodotchetOstatok } from '@/common/models'

import { useEffect } from 'react'

import { SearchFilterDebounced } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { formatNumber } from '@renderer/common/lib/format'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FooterCell, FooterRow, GenericTable, SummaTotal } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { useDates, usePagination } from '@/common/hooks'
import { ListView } from '@/common/views'

import { podotchetOstatokColumns } from './columns'
import { podotchetOstatokQueryKeys } from './config'
import { podotchetOstatokService } from './service'

const PodotchetOstatokPage = () => {
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const dates = useDates()

  const { confirm } = useConfirm()
  const [search] = useSearchFilter()
  const { t } = useTranslation(['app'])

  const { data: podotchetOstatokList, isFetching } = useQuery({
    queryKey: [
      podotchetOstatokQueryKeys.getAll,
      {
        main_schet_id,
        search,
        ...dates,
        ...pagination
      }
    ],
    queryFn: podotchetOstatokService.getAll
  })
  const { mutate: deletePodotchetOstatok, isPending } = useMutation({
    mutationKey: [podotchetOstatokQueryKeys.delete],
    mutationFn: podotchetOstatokService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [podotchetOstatokQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: PodotchetOstatok) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: PodotchetOstatok) => {
    confirm({
      onConfirm() {
        deletePodotchetOstatok(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.ostatok'),
      breadcrumbs: [
        {
          title: t('pages.podotchet')
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
            value={formatNumber(podotchetOstatokList?.meta?.from_summa ?? 0)}
          />
          <SummaTotal.Value
            name={t('debet')}
            value={formatNumber(podotchetOstatokList?.meta?.from_summa_prixod ?? 0)}
          />
          <SummaTotal.Value
            name={t('kredit')}
            value={formatNumber(podotchetOstatokList?.meta?.from_summa_rasxod ?? 0)}
          />
        </SummaTotal>
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={podotchetOstatokList?.data ?? []}
          columnDefs={podotchetOstatokColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          footer={
            <FooterRow>
              <FooterCell
                title={t('total')}
                colSpan={5}
                content={formatNumber(podotchetOstatokList?.meta?.page_prixod_summa ?? 0)}
              />
              <FooterCell
                title={undefined}
                content={formatNumber(podotchetOstatokList?.meta?.page_rasxod_summa ?? 0)}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <SummaTotal className="mb-5">
          <SummaTotal.Value
            name={t('remainder-to')}
            value={formatNumber(podotchetOstatokList?.meta?.to_summa ?? 0)}
          />
          <SummaTotal.Value
            name={t('debet')}
            value={formatNumber(podotchetOstatokList?.meta?.to_summa_prixod ?? 0)}
          />
          <SummaTotal.Value
            name={t('kredit')}
            value={formatNumber(podotchetOstatokList?.meta?.to_summa_rasxod ?? 0)}
          />
        </SummaTotal>
        <ListView.Pagination
          {...pagination}
          pageCount={podotchetOstatokList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default PodotchetOstatokPage
