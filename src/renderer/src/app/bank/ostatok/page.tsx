import type { BankOstatok } from '@/common/models'

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

import { bankOstatokColumns } from './columns'
import { bankOstatokQueryKeys } from './config'
import { bankOstatokService } from './service'

const BankOstatokPage = () => {
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const dates = useDates()

  const { confirm } = useConfirm()
  const [search] = useSearchFilter()
  const { t } = useTranslation(['app'])

  const { data: bankOstatokList, isFetching } = useQuery({
    queryKey: [
      bankOstatokQueryKeys.getAll,
      {
        main_schet_id,
        search,
        ...dates,
        ...pagination
      }
    ],
    queryFn: bankOstatokService.getAll
  })
  const { mutate: deleteOstatok, isPending } = useMutation({
    mutationKey: [bankOstatokQueryKeys.delete],
    mutationFn: bankOstatokService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [bankOstatokQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: BankOstatok) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: BankOstatok) => {
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
            value={formatNumber(bankOstatokList?.meta?.from_summa ?? 0)}
          />
          <SummaTotal.Value
            name={t('debet')}
            value={formatNumber(bankOstatokList?.meta?.from_summa_prixod ?? 0)}
          />
          <SummaTotal.Value
            name={t('kredit')}
            value={formatNumber(bankOstatokList?.meta?.from_summa_rasxod ?? 0)}
          />
        </SummaTotal>
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={bankOstatokList?.data ?? []}
          columnDefs={bankOstatokColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          footer={
            <FooterRow>
              <FooterCell
                title={t('total')}
                colSpan={4}
                content={formatNumber(bankOstatokList?.meta?.page_prixod_summa ?? 0)}
              />
              <FooterCell
                title={undefined}
                content={formatNumber(bankOstatokList?.meta?.page_rasxod_summa ?? 0)}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <SummaTotal className="mb-5">
          <SummaTotal.Value
            name={t('remainder-to')}
            value={formatNumber(bankOstatokList?.meta?.to_summa ?? 0)}
          />
          <SummaTotal.Value
            name={t('debet')}
            value={formatNumber(bankOstatokList?.meta?.to_summa_prixod ?? 0)}
          />
          <SummaTotal.Value
            name={t('kredit')}
            value={formatNumber(bankOstatokList?.meta?.to_summa_rasxod ?? 0)}
          />
        </SummaTotal>
        <ListView.Pagination
          {...pagination}
          pageCount={bankOstatokList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default BankOstatokPage
