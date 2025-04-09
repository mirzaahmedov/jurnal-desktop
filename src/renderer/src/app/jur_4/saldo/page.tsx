import type { PodotchetSaldo } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarDays } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FooterCell, FooterRow, GenericTable } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesStore } from '@/common/features/requisites'
import {
  SaldoNamespace,
  handleSaldoErrorDates,
  handleSaldoResponseDates
} from '@/common/features/saldo'
import { useKeyUp, useToggle } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { podotchetSaldoColumns } from './columns'
import { PodotchetSaldoMonthlyTrackerDialog } from './components/saldo-monthly-tracker-dialog'
import { PodotchetSaldoQueryKeys } from './config'
import { PodotchetSaldoDialog } from './dialog'
import { PodotchetSaldoFilters, useYearFilter } from './filters'
import { PodotchetSaldoService } from './service'

const PodotchetSaldoPage = () => {
  const setLayout = useLayoutStore((store) => store.setLayout)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dialogToggle = useToggle()
  const monthlyTrackerToggle = useToggle()

  const [year, setYear] = useYearFilter()
  const [selected, setSelected] = useState<PodotchetSaldo | null>(null)

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id, jur4_schet_id } = useRequisitesStore()

  const { data: saldo, isFetching } = useQuery({
    queryKey: [
      PodotchetSaldoQueryKeys.getAll,
      {
        main_schet_id,
        budjet_id,
        year
      }
    ],
    queryFn: PodotchetSaldoService.getAll
  })
  const { mutate: cleanSaldo, isPending } = useMutation({
    mutationKey: [PodotchetSaldoQueryKeys.clean],
    mutationFn: PodotchetSaldoService.cleanSaldo,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [PodotchetSaldoQueryKeys.getAll]
      })
      handleSaldoResponseDates(SaldoNamespace.JUR_4, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_4, error)
    }
  })

  const handleClickEdit = (row: PodotchetSaldo) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickClean = () => {
    confirm({
      withPassword: true,
      onConfirm(password) {
        cleanSaldo({
          schet_id: jur4_schet_id!,
          main_schet_id: main_schet_id!,
          password
        })
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.saldo'),
      breadcrumbs: [
        {
          title: t('pages.organization')
        }
      ],
      content: PodotchetSaldoFilters,
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
      <ListView.Header>
        <ButtonGroup className="w-full flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            onClick={monthlyTrackerToggle.open}
          >
            <CalendarDays className="btn-icon" />
            {t('monthly_saldo')}
          </Button>
        </ButtonGroup>
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={saldo?.data ?? []}
          columnDefs={podotchetSaldoColumns}
          onEdit={handleClickEdit}
          footer={
            <FooterRow>
              <FooterCell
                title={t('total')}
                colSpan={4}
                content={formatNumber(saldo?.meta?.summa ?? 0)}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <PodotchetSaldoDialog
        open={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        selected={selected}
      />
      <PodotchetSaldoMonthlyTrackerDialog
        open={monthlyTrackerToggle.isOpen}
        onOpenChange={monthlyTrackerToggle.setOpen}
        onSelect={(month) => {
          setYear(month.getFullYear())
        }}
      />
    </ListView>
  )
}

export default PodotchetSaldoPage
