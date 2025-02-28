import { useEffect } from 'react'

import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { useDates, usePagination } from '@renderer/common/hooks'
import { formatDate } from '@renderer/common/lib/date'
import { ListView } from '@renderer/common/views'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useOstatokStore } from '@/app/jurnal-7/ostatok/store'
import { validateOstatokDate } from '@/app/jurnal-7/ostatok/utils'
import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { toast } from '@/common/hooks/use-toast'

import { columns, queryKeys } from './config'
import { useInternalTransferDelete, useInternalTransferList } from './service'

const Jurnal7InternalTransferPage = () => {
  const pagination = usePagination()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { search } = useSearch()
  const { recheckOstatok, minDate, maxDate } = useOstatokStore()

  const dates = useDates({
    defaultFrom: formatDate(minDate),
    defaultTo: formatDate(maxDate)
  })

  const { mutate: deleteInternalTransfer, isPending } = useInternalTransferDelete({
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      toast({
        title: 'Внутренний перевод успешно удален'
      })
      recheckOstatok?.()
    },
    onError() {
      toast({
        title: 'Ошибка при удалении внутреннего перевода',
        variant: 'destructive'
      })
    }
  })
  const { data: transferList, isFetching } = useInternalTransferList({
    params: {
      ...pagination,
      ...dates,
      search,
      main_schet_id
    }
  })

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
          columnDefs={columns}
          data={transferList?.data ?? []}
          onEdit={(row) => navigate(`${row.id}`)}
          onDelete={(row) => {
            confirm({
              title: 'Удалить внутренний перевод?',
              onConfirm: () => deleteInternalTransfer(row.id)
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
