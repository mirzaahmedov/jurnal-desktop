import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { GenericTable, useTableSort } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/common/components/ui/dropdown-menu'
import { DownloadFile } from '@/common/features/file'
import { useRequisitesStore } from '@/common/features/requisites'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useSettingsStore } from '@/common/features/settings'
import { useDates, usePagination, useToggle } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { type Jur7Monitoring, Jur7MonitoringType } from '@/common/models'
import { ListView } from '@/common/views'

import { columns } from './columns'
import { Jur7MonitorService } from './service'

export const Jur7MonitorPage = () => {
  const dates = useDates()
  const pagination = usePagination()
  const navigate = useNavigate()
  const reportsToggle = useToggle()
  const startDate = useSelectedMonthStore((store) => store.startDate)
  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const report_title_id = useSettingsStore((store) => store.report_title_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const { sorting, getColumnSorted, handleSort } = useTableSort()

  const { data: monitoring, isFetching } = useQuery({
    queryKey: [
      'jur7_monitoring',
      {
        ...dates,
        ...pagination,
        ...sorting,
        budjet_id
      }
    ],
    queryFn: Jur7MonitorService.getAll
  })

  const handleEdit = (row: Jur7Monitoring) => {
    switch (row.type) {
      case Jur7MonitoringType.prixod:
        navigate(`/journal-7/prixod/${row.id}`)
        break
      case Jur7MonitoringType.rasxod:
        navigate(`/journal-7/rasxod/${row.id}`)
        break
      case Jur7MonitoringType.internal:
        navigate(`/journal-7/internal/${row.id}`)
        break
      default:
        toast.error(t('unknown_type'))
    }
  }

  useEffect(() => {
    setLayout({
      title: t('pages.monitoring'),
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        }
      ]
    })
  }, [t, setLayout])

  return (
    <ListView>
      <ListView.Header>
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
              <span className="titlecase">
                {t('download-something', { something: t('reports') })}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            onInteractOutside={reportsToggle.close}
          >
            <DropdownMenuItem>
              <DownloadFile
                fileName={`оборотка_${dates.to}.xlsx`}
                url="/jur_7/monitoring/obrotka/report"
                params={{
                  to: dates.to,
                  budjet_id,
                  excel: true
                }}
                buttonText="Оборотка"
                className="w-full"
              />
            </DropdownMenuItem>

            <DropdownMenuItem>
              <DownloadFile
                fileName={`материальная_${dates.to}.xlsx`}
                url="/jur_7/monitoring/material/report"
                params={{
                  to: dates.to,
                  year: startDate.getFullYear,
                  month: startDate.getMonth() + 1,
                  budjet_id,
                  excel: true
                }}
                buttonText="Материальная"
                className="w-full"
              />
            </DropdownMenuItem>

            <DropdownMenuItem>
              <DownloadFile
                fileName={`шапка_${startDate.getMonth() + 1}-${startDate.getFullYear()}.xlsx`}
                url="/jur_7/monitoring/cap/report"
                params={{
                  month: startDate.getMonth() + 1,
                  year: startDate.getFullYear(),
                  budjet_id,
                  report_title_id,
                  excel: true
                }}
                buttonText="Шапка"
                className="w-full"
              />
            </DropdownMenuItem>

            <DropdownMenuItem>
              <DownloadFile
                fileName={`шапка2_${dates.to}.xlsx`}
                url="/jur_7/monitoring/cap/back/report"
                params={{
                  to: dates.to,
                  budjet_id,
                  excel: true
                }}
                buttonText="Шапка (2)"
                className="w-full"
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
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={monitoring?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}
