import type { BankRasxod } from '@renderer/common/models'

import { useEffect } from 'react'

import { FooterCell, FooterRow, GenericTable } from '@renderer/common/components'
import { Button } from '@renderer/common/components/ui/button'
import { useConfirm } from '@renderer/common/features/confirm'
import { SearchFilterDebounced } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useDates, usePagination } from '@renderer/common/hooks'
import { formatNumber } from '@renderer/common/lib/format'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CopyPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { rasxodColumns } from './columns'
import { queryKeys } from './constants'
import { RasxodService } from './service'

const BankRasxodPage = () => {
  const { confirm } = useConfirm()
  const [search] = useSearchFilter()
  const { t } = useTranslation(['app'])

  const dates = useDates()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { data: rasxodList, isFetching } = useQuery({
    queryKey: [
      queryKeys.getAll,
      {
        main_schet_id,
        search,
        ...dates,
        ...pagination
      }
    ],
    queryFn: RasxodService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: RasxodService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: BankRasxod) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: BankRasxod) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.rasxod-docs'),
      breadcrumbs: [
        {
          title: t('pages.bank')
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
      <ListView.Header className="gap-5">
        <ListView.RangeDatePicker {...dates} />
        <Button
          onClick={() => {
            navigate('import-zarplata')
          }}
          className="ml-auto"
        >
          {t('import_zarplata')}
        </Button>
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={rasxodList?.data ?? []}
          columnDefs={rasxodColumns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          actions={(row) => (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                row.doc_num = ''
                navigate(`create`, {
                  state: {
                    original: row
                  }
                })
              }}
            >
              <CopyPlus className="size-4" />
            </Button>
          )}
          footer={
            <FooterRow>
              <FooterCell
                title={t('total')}
                content={formatNumber(rasxodList?.meta?.summa ?? 0)}
                colSpan={5}
              />
            </FooterRow>
          }
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

export default BankRasxodPage
