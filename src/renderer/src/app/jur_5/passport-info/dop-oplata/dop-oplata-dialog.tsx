import type { MainZarplata } from '@/common/models'
import type { DopOplata } from '@/common/models/dop-oplata'
import type { DialogTriggerProps } from 'react-aria-components'

import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { cn } from '@/common/lib/utils'

import { DopOplataForm } from './dop-oplata-form'
import { DopOplataService } from './service'

export enum DopOplataTabOptions {
  SickLeave = 'sick_leave',
  AnnualLeave = 'annual_leave'
}

export interface DopOplataDialogProps extends Omit<DialogTriggerProps, 'children'> {
  mainZarplata: MainZarplata
  selected: DopOplata | undefined
}
export const DopOplataDialog = ({ mainZarplata, selected, ...props }: DopOplataDialogProps) => {
  const queryClient = useQueryClient()

  const { t } = useTranslation(['app'])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent
          className={cn('w-full max-w-4xl px-0', selected && 'max-w-full h-full max-h-[900px]')}
        >
          <div className="flex flex-col h-full overflow-hidden gap-5">
            <DialogHeader className="px-5">
              <DialogTitle>{t('dop-oplata')}</DialogTitle>
            </DialogHeader>
            <DopOplataForm
              selected={selected}
              mainZarplata={mainZarplata}
              onFinish={() => {
                props?.onOpenChange?.(false)
                queryClient.invalidateQueries({
                  queryKey: [DopOplataService.QueryKeys.GetByMainId]
                })
              }}
            />
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
