import type { DialogProps } from '@radix-ui/react-dialog'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { MainSchetSelect } from '@/app/region-spravochnik/main-schet'
import { BudjetSelect } from '@/app/super-admin/budjet/budjet-select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog'
import { YearSelect } from '@/common/components/year-select'
import { useRequisitesStore } from '@/common/features/requisites'
import { MonthlySaldoTracker } from '@/common/features/saldo'
import { useSelectedMonthStore } from '@/common/features/selected-month'

import { KassaSaldoQueryKeys } from '../config'
import { KassaSaldoService } from '../service'

export interface KassaSaldoMonthlyTrackerDialogProps extends DialogProps {
  onSelect: (month: Date) => void
}
export const KassaSaldoMonthlyTrackerDialog = ({
  onSelect,
  ...props
}: KassaSaldoMonthlyTrackerDialogProps) => {
  const { t } = useTranslation()

  const [year, setYear] = useState(useSelectedMonthStore.getState().startDate.getFullYear())
  const [budjet, setBudjet] = useState(useRequisitesStore.getState().budjet_id)
  const [mainSchet, setMainSchet] = useState(useRequisitesStore.getState().main_schet_id)

  const { data: saldoMonths, isFetching } = useQuery({
    queryKey: [
      KassaSaldoQueryKeys.getMonthlySaldo,
      {
        main_schet_id: mainSchet!
      }
    ],
    queryFn: KassaSaldoService.getMonthlySaldo,
    enabled: props.open && !!mainSchet
  })

  console.log({
    budjet,
    mainSchet
  })

  return (
    <Dialog {...props}>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader className="flex flex-row items-center gap-10">
          <DialogTitle>{t('monthly_saldo')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div className="flex items-center gap-5 px-10 pt-5">
            <YearSelect
              value={year}
              onValueChange={setYear}
              triggerClassName="w-24"
            />
            <BudjetSelect
              value={budjet}
              onValueChange={(value) => {
                setBudjet(value)
                setMainSchet(undefined)
              }}
              triggerClassName="w-96"
            />
            <MainSchetSelect
              budjet_id={budjet}
              value={mainSchet}
              onValueChange={setMainSchet}
              triggerClassName="w-64"
            />
          </div>
          {mainSchet ? (
            <MonthlySaldoTracker
              year={year}
              data={saldoMonths?.data ?? []}
              loading={isFetching}
              onSelect={onSelect}
            />
          ) : (
            <div className="py-40 grid place-items-center">
              <div className="max-w-md text-center">{t('no_main_schet')}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
