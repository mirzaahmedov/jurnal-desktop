import type { BankSaldo } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesStore } from '@/common/features/requisites'
import {
  SaldoNamespace,
  handleSaldoErrorDates,
  handleSaldoResponseDates,
  useSaldoController
} from '@/common/features/saldo'
import { useKeyUp, useToggle } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { ListView } from '@/common/views'

import { BankSaldoColumns } from './columns'
// import { BankSaldoMonthlyTrackerDialog } from './components/saldo-monthly-tracker-dialog'
import { BankSaldoQueryKeys } from './config'
import { BankSaldoDialog } from './dialog'
import { BankSaldoFilters, useYearFilter } from './filters'
import { BankSaldoService } from './service'

const BankSaldoPage = () => {
  const setLayout = useLayoutStore((store) => store.setLayout)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dialogToggle = useToggle()
  // const monthlyTrackerToggle = useToggle()

  const [year] = useYearFilter()
  const [selected, setSelected] = useState<BankSaldo | null>(null)

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { queuedMonths } = useSaldoController({
    ns: SaldoNamespace.JUR_2
  })
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const {
    data: saldo,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      BankSaldoQueryKeys.getAll,
      {
        main_schet_id,
        budjet_id,
        year
      }
    ],
    queryFn: BankSaldoService.getAll,
    enabled: !!main_schet_id && !queuedMonths.length
  })
  const { mutate: cleanSaldo, isPending } = useMutation({
    mutationKey: [BankSaldoQueryKeys.clean],
    mutationFn: BankSaldoService.cleanSaldo,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [BankSaldoQueryKeys.getAll]
      })
      handleSaldoResponseDates(SaldoNamespace.JUR_2, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_2, error)
    }
  })

  const handleClickEdit = (row: BankSaldo) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickClean = () => {
    confirm({
      withPassword: true,
      onConfirm(password) {
        cleanSaldo({
          main_schet_id: main_schet_id!,
          password
        })
      }
    })
  }

  useEffect(() => {
    handleSaldoErrorDates(SaldoNamespace.JUR_2, error)
  }, [error])
  useEffect(() => {
    setLayout({
      title: t('pages.saldo'),
      breadcrumbs: [
        {
          title: t('pages.bank')
        }
      ],
      content: BankSaldoFilters,
      onCreate: () => {
        setSelected(null)
        dialogToggle.open()
      }
    })
  }, [setLayout, t, navigate, dialogToggle.open])

  useKeyUp({
    key: 'Delete',
    ctrlKey: true,
    onKeyUp: handleClickClean
  })

  return (
    <ListView>
      {/* <ListView.Header>
        <ButtonGroup className="w-full flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            onClick={monthlyTrackerToggle.open}
          >
            <CalendarDays className="btn-icon" />
            {t('monthly_saldo')}
          </Button>
        </ButtonGroup>
      </ListView.Header> */}
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={saldo?.data ?? []}
          columnDefs={BankSaldoColumns}
          onEdit={handleClickEdit}
          getRowEditable={(row) => row.updated}
        />
      </ListView.Content>
      <BankSaldoDialog
        open={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        selected={selected}
      />
      {/* <BankSaldoMonthlyTrackerDialog
        open={monthlyTrackerToggle.isOpen}
        onOpenChange={monthlyTrackerToggle.setOpen}
        onSelect={(month) => {
          setYear(month.getFullYear())
        }}
      /> */}
    </ListView>
  )
}

export default BankSaldoPage
