import type { DialogProps } from '@radix-ui/react-dialog'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog'
import { YearSelect } from '@/common/components/year-select'
import { useRequisitesStore } from '@/common/features/requisites'
import { MonthlySaldoTracker } from '@/common/features/saldo'
import { useSelectedMonthStore } from '@/common/features/selected-month'

import { saldoQueryKeys } from '../config'
import { getMonthlySaldoQuery } from '../service'

export interface MonthlySaldoTrackerDialogProps extends DialogProps {
  onSelect: (month: Date) => void
}
export const MonthlySaldoTrackerDialog = ({
  onSelect,
  ...props
}: MonthlySaldoTrackerDialogProps) => {
  const [year, setYear] = useState(useSelectedMonthStore.getState().startDate.getFullYear())

  const { budjet_id } = useRequisitesStore()
  const { t } = useTranslation()
  const { data: saldoMonths, isFetching } = useQuery({
    queryKey: [
      saldoQueryKeys.getMonthlySaldo,
      {
        year: year,
        budjet_id: budjet_id!
      }
    ],
    queryFn: getMonthlySaldoQuery,
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
