import { useEffect } from 'react'

import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { toast } from '@/common/hooks/use-toast'

import { DateRangeForm } from '../common/components/date-range-form'
import { useJurnal7DateRange } from '../common/components/use-date-range'
import { columns, queryKeys } from './config'
import { useRasxodDelete, useRasxodList } from './service'

const Jurnal7RasxodPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const { search } = useSearch()
  const { confirm } = useConfirm()
  const { form, from, to, applyFilters } = useJurnal7DateRange()

  const { mutate: deleteRasxod, isPending } = useRasxodDelete({
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      toast({
        title: 'Расход успешно удален'
      })
    },
    onError() {
      toast({
        title: 'Ошибка при удалении расхода',
        variant: 'destructive'
      })
    }
  })
  const { data: rasxodList, isFetching } = useRasxodList({
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
      title: t('pages.rasxod-docs'),
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
        <DateRangeForm
          form={form}
          onSubmit={applyFilters}
        />
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columnDefs={columns}
          data={rasxodList?.data ?? []}
          onEdit={(row) => navigate(`${row.id}`)}
          onDelete={(row) => {
            confirm({
              title: 'Удалить расходный документ?',
              onConfirm: () => deleteRasxod(row.id)
            })
          }}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={rasxodList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default Jurnal7RasxodPage
