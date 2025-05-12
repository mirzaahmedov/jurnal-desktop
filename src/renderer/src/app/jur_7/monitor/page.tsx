import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FooterCell, FooterRow, GenericTable, useTableSort } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/common/components/ui/dropdown-menu'
import { DownloadFile } from '@/common/features/file'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { SaldoNamespace, handleSaldoErrorDates } from '@/common/features/saldo'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useSettingsStore } from '@/common/features/settings'
import { useDates, usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { formatNumber } from '@/common/lib/format'
import { type WarehouseMonitoring, WarehouseMonitoringType } from '@/common/models'
import { ListView } from '@/common/views'

import { useWarehouseSaldo } from '../saldo/use-saldo'
import { columns } from './columns'
import { WarehouseMonitorQueryKeys } from './config'
import { MaterialReportDialog } from './material-report-dialog'
import { WarehouseMonitorService } from './service'

export const WarehouseMonitorPage = () => {
  const dates = useDates()
  const pagination = usePagination()
  const navigate = useNavigate()
  const reportsToggle = useToggle()
  const materialToggle = useToggle()
  const startDate = useSelectedMonthStore((store) => store.startDate)
  const report_title_id = useSettingsStore((store) => store.report_title_id)
  const setLayout = useLayout()

  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id } = useRequisitesStore()
  const { sorting, getColumnSorted, handleSort } = useTableSort()
  const { queuedMonths } = useWarehouseSaldo()

  const {
    data: monitoring,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      WarehouseMonitorQueryKeys.getAll,
      {
        ...dates,
        ...pagination,
        ...sorting,
        search,
        budjet_id,
        main_schet_id
      }
    ],
    queryFn: WarehouseMonitorService.getAll,
    enabled: !!budjet_id && !!main_schet_id && !queuedMonths.length
  })

  const handleEdit = (row: WarehouseMonitoring) => {
    switch (row.type) {
      case WarehouseMonitoringType.prixod:
        navigate(`/journal-7/prixod/${row.id}`)
        break
      case WarehouseMonitoringType.rasxod:
        navigate(`/journal-7/rasxod/${row.id}`)
        break
      case WarehouseMonitoringType.internal:
        navigate(`/journal-7/internal/${row.id}`)
        break
      default:
        toast.error(t('unknown_type'))
    }
  }

  useEffect(() => {
    setLayout({
      title: t('pages.monitoring'),
      content: SearchFilterDebounced,
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        }
      ],
      enableSaldo: true
    })
  }, [t, setLayout])
  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_7, error)
    }
  }, [error])

  return (
    <ListView>
      <ListView.Header className="flex items-center justify-between">
        <ListView.RangeDatePicker
          {...dates}
          validateDate={validateDateWithinSelectedMonth}
          calendarProps={{
            fromMonth: startDate,
            toMonth: startDate
          }}
        />

        <DropdownMenu open={reportsToggle.isOpen}>
          <DropdownMenuTrigger
            asChild
            onClick={reportsToggle.open}
          >
            <Button variant="ghost">
              <Download className="btn-icon icon-start" />
              {t('reports')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            onInteractOutside={reportsToggle.close}
          >
            <DropdownMenuItem>
              <DownloadFile
                fileName={`${t('cap')}_${startDate.getMonth() + 1}-${startDate.getFullYear()}.xlsx`}
                url="/jur_7/monitoring/cap/report"
                params={{
                  month: startDate.getMonth() + 1,
                  year: startDate.getFullYear(),
                  budjet_id,
                  main_schet_id,
                  report_title_id,
                  excel: true
                }}
                buttonText={t('cap')}
                className="w-full justify-start"
              />
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Button
                variant="ghost"
                onClick={materialToggle.open}
              >
                <Download className="btn-icon icon-start icon-sm" /> {t('material')}
              </Button>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <DownloadFile
                fileName={`${t('report')}_${startDate.getMonth() + 1}-${startDate.getFullYear()}.xlsx`}
                url="/jur_7/monitoring/schet"
                params={{
                  month: startDate.getMonth() + 1,
                  year: startDate.getFullYear(),
                  is_year: true,
                  main_schet_id,
                  excel: true
                }}
                buttonText={t('cap')}
                className="w-full justify-start"
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ListView.Header>
      <ListView.Content loading={isFetching}>
        <GenericTable
          columnDefs={columns}
          data={monitoring?.data ?? []}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
          onEdit={handleEdit}
          footer={
            <>
              <FooterRow>
                <FooterCell
                  title={t('total_page')}
                  colSpan={5}
                />
                <FooterCell
                  content={formatNumber(monitoring?.meta?.page_prixod_sum ?? 0)}
                  colSpan={1}
                />
                <FooterCell
                  content={formatNumber(monitoring?.meta?.page_rasxod_sum ?? 0)}
                  colSpan={1}
                />
              </FooterRow>
              {(monitoring?.meta?.pageCount ?? 0) > 1 ? (
                <FooterRow>
                  <FooterCell
                    title={t('total_period')}
                    colSpan={4}
                  />
                  <FooterCell
                    content={formatNumber(monitoring?.meta?.prixod_sum ?? 0)}
                    colSpan={1}
                  />
                  <FooterCell
                    content={formatNumber(monitoring?.meta?.rasxod_sum ?? 0)}
                    colSpan={1}
                  />
                </FooterRow>
              ) : null}
            </>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={monitoring?.meta?.count ?? 0}
          pageCount={monitoring?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>

      <MaterialReportDialog
        isOpen={materialToggle.isOpen}
        onOpenChange={materialToggle.setOpen}
        budjet_id={budjet_id!}
        main_schet_id={main_schet_id!}
        to={dates.to}
        year={startDate.getFullYear()}
        month={startDate.getMonth() + 1}
      />
    </ListView>
  )
}
