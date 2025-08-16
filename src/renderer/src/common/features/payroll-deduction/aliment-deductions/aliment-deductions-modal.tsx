import type { AlimentDeduction } from '@/common/models/payroll-deduction'
import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { useToggle } from '@/common/hooks'

import { AlimentDeductionDialog } from './dialog'
import { AlimentDeductionService } from './service'

export interface AlimentDeductionsDialogProps extends Omit<DialogTriggerProps, 'children'> {
  mainZarplataId: number
  deductionId: number
}
export const AlimentDeductionsDialog: FC<AlimentDeductionsDialogProps> = ({
  mainZarplataId,
  deductionId,
  ...props
}) => {
  const { t } = useTranslation(['app'])

  const [alimentDeductionData, setAlimentDeductionData] = useState<AlimentDeduction>()

  const dialogToggle = useToggle()

  const alimentDeductionsQuery = useQuery({
    queryKey: [AlimentDeductionService.QueryKeys.GetAll, { mainId: mainZarplataId }],
    queryFn: AlimentDeductionService.getAll,
    enabled: !!mainZarplataId
  })

  console.log({ data: alimentDeductionsQuery.data ?? [] })

  return (
    <>
      <DialogTrigger {...props}>
        <DialogOverlay>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('aliment-deduction')}</DialogTitle>
              <Button onPress={dialogToggle.open}>{t('add')}</Button>
            </DialogHeader>
            <div></div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>

      <AlimentDeductionDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        mainZarplataId={mainZarplataId}
        deductionId={deductionId}
        alimentDeductionData={alimentDeductionData}
      />
    </>
  )
}
