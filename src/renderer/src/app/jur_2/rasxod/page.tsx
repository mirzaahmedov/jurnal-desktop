import type { BankRasxod } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CopyPlus, Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FooterCell, FooterRow, GenericTable, useTableSort } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { useConfirm } from '@/common/features/confirm'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import {
  SaldoNamespace,
  handleSaldoErrorDates,
  handleSaldoResponseDates
} from '@/common/features/saldo'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useDates, usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { useBankSaldo } from '../saldo/components/use-saldo'
import { BankRasxodColumns } from './columns'
import { BankRasxodQueryKeys } from './config'
import { BankRasxodService } from './service'
import { BankRasxodViewDialog } from './view-dialog'
import { ImportAliment } from './zarplata/import-aliment'

const BankRasxodPage = () => {
  const dates = useDates()
  const navigate = useNavigate()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const importDialogToggle = useToggle()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const startDate = useSelectedMonthStore((store) => store.startDate)
  const setLayout = useLayout()

  const [search] = useSearchFilter()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { confirm } = useConfirm()
  const { queuedMonths } = useBankSaldo()
  const { t } = useTranslation(['app'])

  const {
    data: rasxods,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      BankRasxodQueryKeys.getAll,
      {
        main_schet_id,
        search,
        ...sorting,
        ...dates,
        ...pagination
      }
    ],
    queryFn: BankRasxodService.getAll,
    enabled: !!main_schet_id && !queuedMonths.length
  })
  const { mutate: deleteRasxod, isPending } = useMutation({
    mutationKey: [BankRasxodQueryKeys.delete],
    mutationFn: BankRasxodService.delete,
    onSuccess(res) {
      toast.success(res?.message)

      queryClient.invalidateQueries({
        queryKey: [BankRasxodQueryKeys.getAll]
      })

      handleSaldoResponseDates(SaldoNamespace.JUR_2, res)
    },
    onError(err) {
      handleSaldoErrorDates(SaldoNamespace.JUR_2, err)
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
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_2, error)
    }
  }, [error])
  useEffect(() => {
    setLayout({
      title: t('pages.rasxod-docs'),
      breadcrumbs: [
        {
          title: t('pages.bank')
        }
      ],
      enableSaldo: true,
      content: SearchFilterDebounced,
      onCreate() {
        navigate('create')
      }
    })
  }, [setLayout, t, navigate])

  return (
    <ListView>
      <ListView.Header className="gap-5">
        <ListView.RangeDatePicker
          {...dates}
          validateDate={validateDateWithinSelectedMonth}
          calendarProps={{
            fromMonth: startDate,
            toMonth: startDate
          }}
        />
        <Button
          onClick={() => {
            importDialogToggle.open()
          }}
          className="ml-auto"
        >
          {t('import_zarplata')}
        </Button>
      </ListView.Header>
      <ListView.Content isLoading={isFetching || isPending}>
        <GenericTable
          data={rasxods?.data ?? []}
          columnDefs={BankRasxodColumns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
          actions={(row) => (
            <>
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
              <Button
                variant="ghost"
                size="icon"
                onPress={() => {
                  setSelectedId(row.id)
                }}
              >
                <Eye className="btn-icon" />
              </Button>
            </>
          )}
          footer={
            <FooterRow>
              <FooterCell
                title={t('total')}
                content={formatNumber(rasxods?.meta?.summa ?? 0)}
                colSpan={6}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={rasxods?.meta?.count ?? 0}
          pageCount={rasxods?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <DialogTrigger
        isOpen={importDialogToggle.isOpen}
        onOpenChange={importDialogToggle.setOpen}
      >
        <DialogOverlay>
          <DialogContent className="w-full max-w-[1820px] h-full max-h-[980px] flex flex-col">
            <DialogHeader>
              <DialogTitle>{t('import_zarplata')}</DialogTitle>
            </DialogHeader>
            <ImportAliment />
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>

      <BankRasxodViewDialog
        selectedId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </ListView>
  )
}

export default BankRasxodPage
