import type { KassaOstatok } from '@/common/models'

import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FooterCell, FooterRow, GenericTable, SummaTotal, useTableSort } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesStore } from '@/common/features/requisites'
import { usePagination, useToggle } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { kassaOstatokColumns } from './columns'
import { KassaOstatokQueryKeys } from './config'
import { KassaOstatokDialog } from './dialog'
import { KassaOstatokFilters, useMonthFilter, useYearFilter } from './filters'
import { KassaOstatokService } from './service'

const KassaOstatokPage = () => {
  const setLayout = useLayoutStore((store) => store.setLayout)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const dialogToggle = useToggle()

  const [year] = useYearFilter()
  const [month] = useMonthFilter()

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id } = useRequisitesStore()
  const { sorting, handleSort, getColumnSorted } = useTableSort()

  const { data: kassaOstatokList, isFetching } = useQuery({
    queryKey: [
      KassaOstatokQueryKeys.getAll,
      {
        main_schet_id,
        budjet_id,
        year,
        month,
        ...sorting,
        ...pagination
      }
    ],
    queryFn: KassaOstatokService.getAll
  })
  const { mutate: deleteOstatok, isPending } = useMutation({
    mutationKey: [KassaOstatokQueryKeys.delete],
    mutationFn: KassaOstatokService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [KassaOstatokQueryKeys.getAll]
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
      content: KassaOstatokFilters,
      onCreate: dialogToggle.open
    })
  }, [setLayout, t, navigate, dialogToggle.open])

  return (
    <ListView>
      <ListView.Header>
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
      <KassaOstatokDialog
        open={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        selected={null}
      />
    </ListView>
  )
}

export default KassaOstatokPage
