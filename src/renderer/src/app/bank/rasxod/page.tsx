import type { BankRasxod } from '@/common/models'

import { useEffect } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@renderer/common/components/ui/dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CopyPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { FooterCell, FooterRow, GenericTable, useTableSort } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { useConfirm } from '@/common/features/confirm'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { useLayoutStore } from '@/common/features/layout'
import { useRequisitesStore } from '@/common/features/requisites'
import { useDates, usePagination, useToggle } from '@/common/hooks'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { rasxodColumns } from './columns'
import { queryKeys } from './constants'
import { RasxodService } from './service'
import { ImportAliment } from './zarplata/import-aliment'

const BankRasxodPage = () => {
  const dates = useDates()
  const navigate = useNavigate()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const importDialogToggle = useToggle()

  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const [search] = useSearchFilter()

  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

  const { data: rasxodList, isFetching } = useQuery({
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
    queryFn: RasxodService.getAll
  })
  const { mutate: deleteRasxod, isPending } = useMutation({
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
        deleteRasxod(row.id)
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
            importDialogToggle.open()
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
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
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
      <Dialog
        open={importDialogToggle.isOpen}
        onOpenChange={importDialogToggle.setOpen}
      >
        <DialogContent className="w-full max-w-[1820px] h-full max-h-[980px] flex flex-col">
          <DialogHeader>
            <DialogTitle>{t('import_zarplata')}</DialogTitle>
          </DialogHeader>
          <ImportAliment />
        </DialogContent>
      </Dialog>
    </ListView>
  )
}

export default BankRasxodPage
