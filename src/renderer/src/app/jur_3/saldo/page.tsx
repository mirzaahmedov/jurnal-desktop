import type { OrganSaldo } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { CalendarDays } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
// import { Button } from '@/common/components/ui/button'
// import { ButtonGroup } from '@/common/components/ui/button-group'
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

import { OrganSaldoColumns } from './columns'
// import { OrganSaldoMonthlyTrackerDialog } from './components/saldo-monthly-tracker-dialog'
import { OrganSaldoQueryKeys } from './config'
import { OrganSaldoDialog } from './dialog'
import { OrganSaldoFilters, useYearFilter } from './filters'
import { OrganSaldoService } from './service'

const OrganSaldoPage = () => {
  const setLayout = useLayoutStore((store) => store.setLayout)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dialogToggle = useToggle()
  // const monthlyTrackerToggle = useToggle()

  const [year] = useYearFilter()
  const [selected, setSelected] = useState<OrganSaldo | null>(null)

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id, jur3_schet_id } = useRequisitesStore()

  const { data: saldo, isFetching } = useQuery({
    queryKey: [
      OrganSaldoQueryKeys.getAll,
      {
        main_schet_id,
        budjet_id,
        schet_id: jur3_schet_id,
        year
      }
    ],
    queryFn: OrganSaldoService.getAll
  })
  const { mutate: cleanSaldo, isPending } = useMutation({
    mutationKey: [OrganSaldoQueryKeys.clean],
    mutationFn: OrganSaldoService.cleanSaldo,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [OrganSaldoQueryKeys.getAll]
      })
      handleSaldoResponseDates(SaldoNamespace.JUR_3, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_3, error)
    }
  })

  const handleClickEdit = (row: OrganSaldo) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickClean = () => {
    confirm({
      withPassword: true,
      onConfirm(password) {
        cleanSaldo({
          schet_id: jur3_schet_id!,
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
      content: OrganSaldoFilters,
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
          columnDefs={OrganSaldoColumns}
          onEdit={handleClickEdit}
          getRowEditable={(row) => row.updated}
        />
      </ListView.Content>
      <OrganSaldoDialog
        open={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        selected={selected}
      />
      {/* <OrganSaldoMonthlyTrackerDialog
        open={monthlyTrackerToggle.isOpen}
        onOpenChange={monthlyTrackerToggle.setOpen}
        onSelect={(month) => {
          setYear(month.getFullYear())
        }}
      /> */}
    </ListView>
  )
}

export default OrganSaldoPage
