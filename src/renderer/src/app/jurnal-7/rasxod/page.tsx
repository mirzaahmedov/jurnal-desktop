import { useEffect } from 'react'

import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { usePagination } from '@renderer/common/hooks'
import { useDates } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useOstatokStore } from '@/app/jurnal-7/ostatok/store'
import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'

import { validateOstatokDate } from '../ostatok/validate-date'
import { columns, queryKeys } from './config'
import { useRasxodDelete, useRasxodList } from './service'

const Jurnal7RasxodPage = () => {
  const dates = useDates()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const { search } = useSearch()
  const { confirm } = useConfirm()
  const { recheckOstatok } = useOstatokStore()

  const { mutate: deleteRasxod, isPending } = useRasxodDelete({
    onSuccess(res) {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      toast.success(res?.message)
      recheckOstatok?.()
    },
    onError(error) {
      toast.error(error?.message)
    }
  })
  const { data: rasxodList, isFetching } = useRasxodList({
    params: {
      ...pagination,
      ...dates,
      search,
      main_schet_id
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
        <ListView.RangeDatePicker
          {...dates}
          validateDate={validateOstatokDate}
        />
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columnDefs={columns}
          data={rasxodList?.data ?? []}
          onEdit={(row) => navigate(`${row.id}`)}
          onDelete={(row) => {
            confirm({
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
