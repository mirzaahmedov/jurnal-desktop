import type { KassaSaldo } from '@/common/models'

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
  handleSaldoResponseDates
} from '@/common/features/saldo'
import { useKeyUp, useToggle } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { ListView } from '@/common/views'

import { kassaSaldoColumns } from './columns'
// import { KassaSaldoMonthlyTrackerDialog } from './components/saldo-monthly-tracker-dialog'
import { KassaSaldoQueryKeys } from './config'
import { KassaSaldoDialog } from './dialog'
import { KassaSaldoFilters, useYearFilter } from './filters'
import { KassaSaldoService } from './service'

const KassaSaldoPage = () => {
  const setLayout = useLayoutStore((store) => store.setLayout)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dialogToggle = useToggle()
  // const monthlyTrackerToggle = useToggle()

  const [year] = useYearFilter()
  const [selected, setSelected] = useState<KassaSaldo | null>(null)

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const {
    data: saldo,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      KassaSaldoQueryKeys.getAll,
      {
        main_schet_id,
        budjet_id,
        year
      }
    ],
    queryFn: KassaSaldoService.getAll
  })
  const { mutate: cleanSaldo, isPending } = useMutation({
    mutationKey: [KassaSaldoQueryKeys.clean],
    mutationFn: KassaSaldoService.cleanSaldo,
    onSuccess(res) {
      toast.success(res?.message)

      handleSaldoResponseDates(SaldoNamespace.JUR_1, res)

      requestAnimationFrame(() => {
        queryClient.invalidateQueries({
          queryKey: [KassaSaldoQueryKeys.getAll]
        })
      })
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_1, error)
    }
  })

  const handleClickEdit = (row: KassaSaldo) => {
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
    handleSaldoErrorDates(SaldoNamespace.JUR_1, error)
  }, [error])
  useEffect(() => {
    setLayout({
      title: t('pages.saldo'),
      breadcrumbs: [
        {
          title: t('pages.kassa')
        }
      ],
      content: KassaSaldoFilters,
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
          columnDefs={kassaSaldoColumns}
          onEdit={handleClickEdit}
          getRowEditable={(row) => {
            return row.updated
          }}
        />
      </ListView.Content>
      <KassaSaldoDialog
        open={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        selected={selected}
      />
      {/* <KassaSaldoMonthlyTrackerDialog
        open={monthlyTrackerToggle.isOpen}
        onOpenChange={monthlyTrackerToggle.setOpen}
        onSelect={(month) => {
          setYear(month.getFullYear())
        }}
      /> */}
    </ListView>
  )
}

export default KassaSaldoPage
