import type { KassaPrixod } from '@/common/models'

import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { FooterCell, FooterRow, GenericTable, useTableSort } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { DownloadFile } from '@/common/features/file'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { useSettingsStore } from '@/common/features/settings'
import { useDates, usePagination } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { columns } from './columns'
import { queryKeys } from './constants'
import { kassaPrixodService } from './service'

const KassaPrixodPage = () => {
  const dates = useDates()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const setLayout = useLayoutStore((store) => store.setLayout)

  const [search] = useSearchFilter()

  const { confirm } = useConfirm()
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { t } = useTranslation(['app'])
  const { report_title_id } = useSettingsStore()
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const { data: prixodList, isFetching } = useQuery({
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
    queryFn: kassaPrixodService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: kassaPrixodService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: KassaPrixod) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: KassaPrixod) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.prixod-docs'),
      content: SearchFilterDebounced,
      breadcrumbs: [
        {
          title: t('pages.kassa')
        }
      ],
      onCreate() {
        navigate('create')
      }
    })
  }, [setLayout, t])

  return (
    <ListView>
      <ListView.Header className="flex items-center justify-between">
        <ListView.RangeDatePicker {...dates} />
        <DownloadFile
          fileName={`${t('pages.kassa')}-${t('pages.prixod-docs')}-${dates.from}-${dates.to}.xlsx`}
          url="/kassa/monitoring/prixod"
          params={{
            budjet_id,
            main_schet_id,
            from: dates.from,
            to: dates.to,
            report_title_id,
            excel: true
          }}
          buttonText={t('report')}
        />
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={prixodList?.data ?? []}
          columnDefs={columns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          onSort={handleSort}
          getColumnSorted={getColumnSorted}
          footer={
            <FooterRow>
              <FooterCell
                title={t('total')}
                content={formatNumber(prixodList?.meta?.summa ?? 0)}
                colSpan={5}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={prixodList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default KassaPrixodPage
