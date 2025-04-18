import type { DialogTriggerProps } from 'react-aria-components'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { YearSelect } from '@/common/components/year-select'
import { useRequisitesStore } from '@/common/features/requisites'
import { MonthlySaldoTracker } from '@/common/features/saldo'
import { useSelectedMonthStore } from '@/common/features/selected-month'

import { SaldoQueryKeys } from '../config'
import { MaterialWarehouseSaldoService } from '../service'

export interface MonthlySaldoTrackerDialogProps extends Omit<DialogTriggerProps, 'children'> {
  onSelect: (month: Date) => void
}
export const MonthlySaldoTrackerDialog = ({
  onSelect,
  ...props
}: MonthlySaldoTrackerDialogProps) => {
  const { startDate } = useSelectedMonthStore()

  const [year, setYear] = useState(startDate.getFullYear())

  const { budjet_id, main_schet_id } = useRequisitesStore()
  const { t } = useTranslation()
  const { data: saldoMonths, isFetching } = useQuery({
    queryKey: [
      SaldoQueryKeys.getMonthlySaldo,
      {
        year: year,
        budjet_id: budjet_id!,
        main_schet_id: main_schet_id!
      }
    ],
    queryFn: MaterialWarehouseSaldoService.getMonthlySaldo,
    enabled: props.isOpen
  })

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-4xl">
          <DialogHeader className="flex flex-row items-center gap-10">
            <DialogTitle>{t('monthly_saldo')}</DialogTitle>
            <YearSelect
              selectedKey={year}
              onSelectionChange={(value) =>
                setYear(value ? Number(value) : startDate.getFullYear())
              }
              className="w-24"
            />
          </DialogHeader>
          <MonthlySaldoTracker
            year={year}
            data={saldoMonths?.data ?? []}
            loading={isFetching}
            onSelect={onSelect}
          />
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
