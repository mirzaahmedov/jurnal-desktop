import { useEffect, useState } from 'react'

import { ButtonGroup } from '@renderer/common/components/ui/button-group'
import { DownloadFile } from '@renderer/common/features/file'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { usePagination } from '@renderer/common/hooks'
import { HttpResponseError } from '@renderer/common/lib/http'
import { ListView } from '@renderer/common/views'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'

import { DateRangeForm } from '../common/components/date-range-form'
import { useJurnal7DateRange } from '../common/components/use-date-range'
import { columns, queryKeys } from './config'
import { ErrorAlert, type ErrorData, type ErrorDataDocument } from './error-alert'
import { usePrixodDelete, usePrixodList } from './service'

const Jurnal7PrixodPage = () => {
  const [error, setError] = useState<ErrorData>()

  const pagination = usePagination()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { confirm } = useConfirm()
  const { search } = useSearch()
  const { t } = useTranslation(['app'])

  const setLayout = useLayoutStore((store) => store.setLayout)
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const { form, from, to, applyFilters } = useJurnal7DateRange()

  const { mutate: deletePrixod, isPending: isDeleting } = usePrixodDelete({
    onSuccess(res) {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      toast.success(res?.message)
    },
    onError(error) {
      console.log(error)
      if (error instanceof HttpResponseError) {
        setError({
          message: error?.message ?? '',
          document: error.meta?.[0] as ErrorDataDocument
        })
      }
      toast.error(error?.message)
    }
  })
  const { data: prixodList, isFetching } = usePrixodList({
    params: {
      ...pagination,
      search,
      main_schet_id,
      from,
      to
    }
  })

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
      <div className="p-5 flex items-center justify-between">
        <DateRangeForm
          form={form}
          onSubmit={applyFilters}
        />
        {main_schet_id ? (
          <ButtonGroup>
            <DownloadFile
              url="jur_7/doc_prixod/report"
              fileName={`jur7_prixod_report-${from}&${to}.xlsx`}
              buttonText={t('download-something', { something: t('report') })}
              params={{
                from,
                to,
                main_schet_id,
                excel: true
              }}
            />
          </ButtonGroup>
        ) : null}
      </div>
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
      {error?.document ? (
        <ErrorAlert
          error={error}
          open
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setError(undefined)
            }
          }}
        />
      ) : null}
    </ListView>
  )
}

export default Jurnal7PrixodPage
