import type { FinancialReceipt } from '@/common/models'

import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FooterCell, FooterRow, GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesStore } from '@/common/features/requisites'
import { usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { FinancialReceiptColumns } from './columns'
import { FinancialReceiptQueryKeys } from './config'
import { FinancialReceiptFilters, useYearFilter } from './filters'
import { FinancialReceiptService } from './service'

const FinancialReceiptPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const setLayout = useLayout()

  const [year] = useYearFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const { data: financialReceipts, isFetching } = useQuery({
    queryKey: [
      FinancialReceiptQueryKeys.getAll,
      {
        ...pagination,
        year,
        budjet_id,
        main_schet_id
      }
    ],
    queryFn: FinancialReceiptService.getAll
  })
  const { mutate: deleteMonitor, isPending } = useMutation({
    mutationKey: [FinancialReceiptQueryKeys.delete],
    mutationFn: FinancialReceiptService.delete,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [FinancialReceiptQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.monitoring'),
      breadcrumbs: [
        {
          title: t('pages.jur8')
        }
      ],
      content: FinancialReceiptFilters,
      onCreate: () => {
        navigate('create')
      }
    })
  }, [setLayout, navigate, t])

  const handleEdit = (row: FinancialReceipt) => {
    navigate(`${row.id}`)
  }
  const handleDelete = (row: FinancialReceipt) => {
    confirm({
      onConfirm: () => {
        deleteMonitor(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content isLoading={isFetching || isPending}>
        <GenericTable
          columnDefs={FinancialReceiptColumns}
          data={financialReceipts?.data ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          footer={
            <FooterRow>
              <FooterCell
                colSpan={5}
                title={t('total')}
                content={formatNumber(financialReceipts?.meta?.summa ?? 0)}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={financialReceipts?.meta?.count ?? 0}
          pageCount={financialReceipts?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default FinancialReceiptPage
