import { useEffect } from 'react'

import { useRequisitesStore } from '@renderer/common/features/requisites'
import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { toast } from '@/common/hooks/use-toast'

import { DateRangeForm } from '../common/components/date-range-form'
import { useJurnal7DateRange } from '../common/components/use-date-range'
import { columns, queryKeys } from './config'
import { useInternalTransferDelete, useInternalTransferList } from './service'

const InternalTransferPage = () => {
  const pagination = usePagination()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { form, from, to, applyFilters } = useJurnal7DateRange()

  const { mutate: deleteInternalTransfer, isPending } = useInternalTransferDelete({
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      toast({
        title: 'Внутренний перевод успешно удален'
      })
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
      main_schet_id,
      from,
      to
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.internal-docs'),
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
        <DateRangeForm
          form={form}
          onSubmit={applyFilters}
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
          pageCount={transferList?.meta.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export { InternalTransferPage }
