import { useEffect } from 'react'

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
  handleOstatokResponse,
  validateOstatokDate
} from '@/app/jurnal-7/ostatok/utils'
import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'

import { internalColumns } from './columns'
import { internalQueryKeys } from './config'
import { internalService } from './service'

const Jurnal7InternalTransferPage = () => {
  const pagination = usePagination()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { search } = useSearch()
  const { recheckOstatok, minDate, maxDate, queuedMonths } = useOstatokStore()

  const dates = useDates({
    defaultFrom: formatDate(minDate),
    defaultTo: formatDate(maxDate)
  })

  const { mutate: deleteTransfer, isPending } = useMutation({
    mutationKey: [internalQueryKeys.delete],
    mutationFn: internalService.delete,
    onSuccess(res) {
      handleOstatokResponse(res)
      toast.success(res?.message)
      recheckOstatok?.()
      requestAnimationFrame(() => {
        queryClient.invalidateQueries({
          queryKey: [internalQueryKeys.getAll]
        })
      })
    }
  })

  const {
    data: transferList,
    isFetching,
    error: transferListError
  } = useQuery({
    queryKey: [
      internalQueryKeys.getAll,
      {
        ...pagination,
        ...dates,
        search,
        main_schet_id
      }
    ],
    queryFn: internalService.getAll,
    enabled: queuedMonths.length === 0
  })

  useEffect(() => {
    handleOstatokError(transferListError)
  }, [transferListError])

  useEffect(() => {
    setLayout({
      title: t('pages.internal-docs'),
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
        <ListView.RangeDatePicker
          {...dates}
          validateDate={validateOstatokDate}
          calendarProps={{
            fromMonth: minDate,
            toMonth: maxDate
          }}
        />
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columnDefs={internalColumns}
          data={transferList?.data ?? []}
          onEdit={(row) => navigate(`${row.id}`)}
          onDelete={(row) => {
            confirm({
              onConfirm: () => deleteTransfer(row.id)
            })
          }}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={transferList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default Jurnal7InternalTransferPage
