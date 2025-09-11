import type { MainZarplata } from '@/common/models'
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

import { OtdelniyRaschetForm } from './otdelniy-raschet-form'
import { OtdelniyRaschetService } from './service'

export interface OtdelniyRaschetCreateDialogProps extends Omit<DialogTriggerProps, 'children'> {
  mainZarplata: MainZarplata
}
export const OtdelniyRaschetCreateDialog = ({
  mainZarplata,
  ...props
}: OtdelniyRaschetCreateDialogProps) => {
  const queryClient = useQueryClient()

  const { t } = useTranslation(['app'])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-4xl h-full max-h-[700px] px-0">
          <div className="flex flex-col h-full overflow-hidden gap-5">
            <DialogHeader className="px-5">
              <DialogTitle>{t('otdelniy_raschet')}</DialogTitle>
            </DialogHeader>
            <OtdelniyRaschetForm
              mainZarplata={mainZarplata}
              onFinish={() => {
                props?.onOpenChange?.(false)
                queryClient.invalidateQueries({
                  queryKey: [OtdelniyRaschetService.QueryKeys.GetByMainZarplataId]
                })
              }}
            />
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
