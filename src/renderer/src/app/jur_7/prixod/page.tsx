import type { ExistingDocument } from './details/interfaces'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  handleOstatokError,
  handleOstatokExistingDocumentError,
  handleOstatokResponse
} from '@/app/jur_7/saldo/utils'
import { GenericTable, useTableSort } from '@/common/components'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { useConfirm } from '@/common/features/confirm'
import { DownloadFile } from '@/common/features/file'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useDates, usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { formatDate } from '@/common/lib/date'
import { ListView } from '@/common/views'

import { IznosQueryKeys } from '../iznos/config'
import { SaldoQueryKeys } from '../saldo'
import { useWarehouseSaldo } from '../saldo/use-saldo'
import { prixodColumns } from './columns'
import { WarehousePrixodQueryKeys } from './config'
import { ExistingDocumentsAlert } from './details/existing-document-alert'
import { WarehousePrixodService } from './service'

const Jurnal7PrixodPage = () => {
  const [existingDocsError, setExistingDocsError] = useState<{
    message: string
    docs: ExistingDocument[]
  }>()

  const pagination = usePagination()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { startDate, endDate } = useSelectedMonthStore()
  const { budjet_id, main_schet_id } = useRequisitesStore()
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { queuedMonths } = useWarehouseSaldo()

  const dates = useDates({
    defaultFrom: formatDate(startDate),
    defaultTo: formatDate(endDate)
  })

  const setLayout = useLayout()

  const { mutate: deletePrixod, isPending: isDeleting } = useMutation({
    mutationKey: [WarehousePrixodQueryKeys.delete],
    mutationFn: WarehousePrixodService.delete,
    onSuccess(res) {
      handleOstatokResponse(res)
      toast.success(res?.message)
      requestAnimationFrame(() => {
        queryClient.invalidateQueries({
          queryKey: [WarehousePrixodQueryKeys.getAll]
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
    },
    onError(error) {
      const result = handleOstatokExistingDocumentError<ExistingDocument>(error)
      if (result) {
        setExistingDocsError({
          message: error.message,
          docs: result.docs
        })
      } else {
        setExistingDocsError(undefined)
      }
    }
  })

  const {
    data: prixods,
    isFetching,
    error: prixodsError
  } = useQuery({
    queryKey: [
      WarehousePrixodQueryKeys.getAll,
      {
        ...sorting,
        ...pagination,
        ...dates,
        search,
        budjet_id,
        main_schet_id
      }
    ],
    queryFn: WarehousePrixodService.getAll,
    enabled: queuedMonths.length === 0
  })

  useEffect(() => {
    if (prixodsError) {
      handleOstatokError(prixodsError)
    }
  }, [prixodsError])

  useEffect(() => {
    setLayout({
      title: t('pages.prixod-docs'),
      content: SearchFilterDebounced,
      isSelectedMonthVisible: true,
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
      <ListView.Header>
        <div className="w-full flex items-center justify-between gap-5">
          <ListView.RangeDatePicker
            {...dates}
            validateDate={validateDateWithinSelectedMonth}
            calendarProps={{
              fromMonth: startDate,
              toMonth: endDate
            }}
          />
          {main_schet_id ? (
            <ButtonGroup>
              <DownloadFile
                url="jur_7/doc_prixod/report"
                fileName={`jur7_prixod_report-${dates.from}&${dates.to}.xlsx`}
                buttonText={t('download-something', { something: t('report') })}
                params={{
                  from: dates.from,
                  to: dates.to,
                  budjet_id,
                  main_schet_id,
                  excel: true
                }}
              />
            </ButtonGroup>
          ) : null}
        </div>
      </ListView.Header>
      <ListView.Content
        loading={isFetching || isDeleting}
        className="flex-1 relative"
      >
        <GenericTable
          columnDefs={prixodColumns}
          data={prixods?.data ?? []}
          onEdit={(row) => navigate(`${row.id}`)}
          onDelete={(row) => {
            confirm({
              onConfirm: () => deletePrixod(row.id)
            })
          }}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={prixods?.meta?.count ?? 0}
          pageCount={prixods?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      {existingDocsError ? (
        <ExistingDocumentsAlert
          open
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setExistingDocsError(undefined)
            }
          }}
          docs={existingDocsError.docs}
          message={existingDocsError.message}
        />
      ) : null}
    </ListView>
  )
}

export default Jurnal7PrixodPage
