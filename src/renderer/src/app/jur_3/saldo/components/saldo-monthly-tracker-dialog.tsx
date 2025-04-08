import type { DialogProps } from '@radix-ui/react-dialog'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog'
import { YearSelect } from '@/common/components/year-select'
import { useRequisitesStore } from '@/common/features/requisites'
import { MonthlySaldoTracker } from '@/common/features/saldo'
import { useSelectedMonthStore } from '@/common/features/selected-month'

import { BankSaldoQueryKeys } from '../config'
import { OrganSaldoService } from '../service'

export interface SaldoMonthlyTrackerDialogProps extends DialogProps {
  onSelect: (month: Date) => void
}
export const SaldoMonthlyTrackerDialog = ({
  onSelect,
  ...props
}: SaldoMonthlyTrackerDialogProps) => {
  const { t } = useTranslation()

  const [year, setYear] = useState(useSelectedMonthStore.getState().startDate.getFullYear())

  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

  const { data: saldoMonths, isFetching } = useQuery({
    queryKey: [
      BankSaldoQueryKeys.getMonthlySaldo,
      {
        main_schet_id: main_schet_id!
      }
    ],
    queryFn: OrganSaldoService.getMonthlySaldo,
    enabled: props.open
  })

  return (
    <Dialog {...props}>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader className="flex flex-row items-center gap-10">
          <DialogTitle>{t('monthly_saldo')}</DialogTitle>
          <YearSelect
            value={year}
            onValueChange={setYear}
            triggerClassName="w-24"
          />
        </DialogHeader>
        <MonthlySaldoTracker
          year={year}
          data={saldoMonths?.data ?? []}
          loading={isFetching}
          onSelect={onSelect}
        />
      </DialogContent>
    </Dialog>
  )
}
