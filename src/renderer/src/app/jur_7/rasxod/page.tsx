import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Download, Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { handleOstatokError, handleOstatokResponse } from '@/app/jur_7/saldo/utils'
import { FooterCell, FooterRow, GenericTable, useTableSort } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { useConfirm } from '@/common/features/confirm'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { useSelectedMonthStore } from '@/common/features/selected-month'
import { validateDateWithinSelectedMonth } from '@/common/features/selected-month'
import { useDates, usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { formatDate } from '@/common/lib/date'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { IznosQueryKeys } from '../iznos/config'
import { SaldoQueryKeys } from '../saldo'
import { useMaterialSaldo } from '../saldo/use-saldo'
import { rasxodColumns } from './columns'
import { WarehouseRasxodQueryKeys } from './config'
import { ReportDialog } from './report-dialog'
import { WarehouseRasxodService } from './service'
import { WarehouseRasxodViewDialog } from './view-dialog'

const Jurnal7RasxodPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dialogToggle = useToggle()
  const pagination = usePagination()
  const setLayout = useLayout()

  const [search] = useSearchFilter()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { startDate, endDate } = useSelectedMonthStore()
  const { budjet_id, main_schet_id } = useRequisitesStore()
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { queuedMonths } = useMaterialSaldo()

  const dates = useDates({
    defaultFrom: formatDate(startDate),
    defaultTo: formatDate(endDate)
  })

  const { mutate: deleteRasxod, isPending } = useMutation({
    mutationKey: [WarehouseRasxodQueryKeys.delete],
    mutationFn: WarehouseRasxodService.delete,
    onSuccess(res) {
      handleOstatokResponse(res)
      toast.success(res?.message)
      requestAnimationFrame(() => {
        queryClient.invalidateQueries({
          queryKey: [WarehouseRasxodQueryKeys.getAll]
        })
        queryClient.invalidateQueries({
          queryKey: [SaldoQueryKeys.check]
        })
        queryClient.invalidateQueries({
          queryKey: [SaldoQueryKeys.getAll]
        })
        queryClient.invalidateQueries({
          queryKey: [IznosQueryKeys.getAll]
        })
      })
    }
  })

  const {
    data: rasxods,
    isFetching,
    error: rasxodsError
  } = useQuery({
    queryKey: [
      WarehouseRasxodQueryKeys.getAll,
      {
        ...pagination,
        ...dates,
        ...sorting,
        search,
        budjet_id,
        main_schet_id
      }
    ],
    queryFn: WarehouseRasxodService.getAll,
    enabled: queuedMonths.length === 0
  })

  useEffect(() => {
    if (rasxodsError) {
      handleOstatokError(rasxodsError)
    }
  }, [rasxodsError])

  useEffect(() => {
    setLayout({
      title: t('pages.rasxod-docs'),
      content: SearchFilterDebounced,
      enableSaldo: true,
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        }
      ],
      onCreate() {
        navigate('create')
      }
    })
  }, [setLayout, navigate, t])

  return (
    <ListView>
      <ListView.Header className="flex justify-between">
        <ListView.RangeDatePicker
          {...dates}
          validateDate={validateDateWithinSelectedMonth}
          calendarProps={{
            fromMonth: startDate,
            toMonth: endDate
          }}
        />
        <Button
          variant="ghost"
          IconStart={Download}
        >
          {t('report')}
        </Button>
      </ListView.Header>
      <ListView.Content isLoading={isFetching || isPending}>
        <GenericTable
          columnDefs={rasxodColumns}
          data={rasxods?.data ?? []}
          onEdit={(row) => navigate(`${row.id}`)}
          onDelete={(row) => {
            confirm({
              onConfirm: () => deleteRasxod(row.id)
            })
          }}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
          actions={(row) => (
            <Button
              variant="ghost"
              size="icon"
              onPress={() => {
                setSelectedId(row.id)
              }}
            >
              <Eye className="btn-icon" />
            </Button>
          )}
          footer={
            <FooterRow>
              <FooterCell
                title={t('total')}
                content={formatNumber(rasxods?.meta?.summa ?? 0)}
                colSpan={6}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={rasxods?.meta?.count ?? 0}
          pageCount={rasxods?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>

      <WarehouseRasxodViewDialog
        selectedId={selectedId}
        onClose={() => setSelectedId(null)}
      />
      <ReportDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        budjet_id={budjet_id!}
        main_schet_id={main_schet_id!}
      />
    </ListView>
  )
}

export default Jurnal7RasxodPage
