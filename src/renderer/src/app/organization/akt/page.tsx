import type { Akt } from '@/common/models'

import { useEffect } from 'react'

import { DownloadFile } from '@renderer/common/features/file'
import { SearchFilterDebounced } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { formatNumber } from '@renderer/common/lib/format'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FooterCell, FooterRow, GenericTable, useTableSort } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { useDates, usePagination } from '@/common/hooks'
import { ListView } from '@/common/views'

import { columns } from './columns'
import { queryKeys } from './config'
import { aktService } from './service'

const AktPage = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const pagination = usePagination()

  const dates = useDates()

  const main_schet_id = useRequisitesStore((state) => state.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const [search] = useSearchFilter()

  const { confirm } = useConfirm()
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { t } = useTranslation(['app'])

  const { data: aktList, isFetching } = useQuery({
    queryKey: [
      queryKeys.getAll,
      {
        main_schet_id,
        search,
        ...sorting,
        ...dates,
        ...pagination
      }
    ],
    queryFn: aktService.getAll
  })
  const { mutate: deleteAkt, isPending: isDeletingAkt } = useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: aktService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: Akt) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: Akt) => {
    confirm({
      onConfirm() {
        deleteAkt(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.akt'),
      breadcrumbs: [
        {
          title: t('pages.organization')
        }
      ],
      content: SearchFilterDebounced,
      onCreate() {
        navigate('create')
      }
    })
  }, [setLayout, t, navigate])

  return (
    <ListView>
      <ListView.Header className="flex flex-row items-center justify-between">
        <ListView.RangeDatePicker {...dates} />
        <DownloadFile
          fileName={`aкт-приема-пересдач_шапка-${dates.from}&${dates.to}.xlsx`}
          url="/akt/export/cap"
          params={{
            main_schet_id,
            from: dates.from,
            to: dates.to,
            excel: true
          }}
          buttonText={t('cap-report')}
        />
      </ListView.Header>
      <ListView.Content loading={isFetching || isDeletingAkt}>
        <GenericTable
          data={aktList?.data ?? []}
          columnDefs={columns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
          footer={
            <FooterRow>
              <FooterCell
                colSpan={6}
                title={t('total')}
                content={formatNumber(aktList?.meta?.summa ?? 0)}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={aktList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default AktPage
