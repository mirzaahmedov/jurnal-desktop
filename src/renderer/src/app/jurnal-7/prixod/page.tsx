import type { ExistingDocument } from './details/interfaces'

import { useEffect, useState } from 'react'

import { ButtonGroup } from '@renderer/common/components/ui/button-group'
import { DownloadFile } from '@renderer/common/features/file'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { useDates, usePagination } from '@renderer/common/hooks'
import { formatDate } from '@renderer/common/lib/date'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useOstatokStore } from '@/app/jurnal-7/ostatok/store'
import {
  handleOstatokError,
  handleOstatokExistingDocumentError,
  handleOstatokResponse,
  validateOstatokDate
} from '@/app/jurnal-7/ostatok/utils'
import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'

import { columns, queryKeys } from './config'
import { ExistingDocumentsAlert } from './details/existing-document-alert'
import { prixodService } from './service'

const Jurnal7PrixodPage = () => {
  const [existingDocsError, setExistingDocsError] = useState<{
    message: string
    docs: ExistingDocument[]
  }>()

  const pagination = usePagination()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { t } = useTranslation(['app'])
  const { search } = useSearch()
  const { confirm } = useConfirm()
  const { recheckOstatok, minDate, maxDate, queuedMonths } = useOstatokStore()

  const dates = useDates({
    defaultFrom: formatDate(minDate),
    defaultTo: formatDate(maxDate)
  })

  const setLayout = useLayoutStore((store) => store.setLayout)
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

  const { mutate: deletePrixod, isPending: isDeleting } = useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: prixodService.delete,
    onSuccess(res) {
      handleOstatokResponse(res)
      toast.success(res?.message)
      recheckOstatok?.()
      requestAnimationFrame(() => {
        queryClient.invalidateQueries({
          queryKey: [queryKeys.getAll]
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
    data: prixodList,
    isFetching,
    error: prixodListError
  } = useQuery({
    queryKey: [
      queryKeys.getAll,
      {
        ...pagination,
        ...dates,
        search,
        main_schet_id
      }
    ],
    queryFn: prixodService.getAll,
    enabled: queuedMonths.length === 0
  })

  useEffect(() => {
    handleOstatokError(prixodListError)
  }, [prixodListError])

  useEffect(() => {
    setLayout({
      title: t('pages.prixod-docs'),
      content: SearchField,
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
            validateDate={validateOstatokDate}
            calendarProps={{
              fromMonth: minDate,
              toMonth: maxDate
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
          columnDefs={columns}
          data={prixodList?.data ?? []}
          onEdit={(row) => navigate(`${row.id}`)}
          onDelete={(row) => {
            confirm({
              onConfirm: () => deletePrixod(row.id)
            })
          }}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={prixodList?.meta?.pageCount ?? 0}
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
