import type { DialogTriggerProps } from 'react-aria-components'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'

import { TabelService } from './service'
import { TabelForm } from './tabel-form'

export interface TabelCreateDialogProps extends Omit<DialogTriggerProps, 'children'> {
  budjetId: number
  mainSchetId: number
}
export const TabelCreateDialog = ({ budjetId, mainSchetId, ...props }: TabelCreateDialogProps) => {
  const { t } = useTranslation(['app'])

  const queryClient = useQueryClient()

  const { mutate: createTabel, isPending: isCreating } = useMutation({
    mutationFn: TabelService.create,
    onSuccess: () => {
      toast.success(t('create_success'))
      queryClient.invalidateQueries({
        queryKey: [TabelService.QueryKeys.GetAll]
      })
      props.onOpenChange?.(false)
    },
    onError: () => {
      toast.error(t('create_failed'))
    }
  })

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-6xl h-full max-h-[700px] px-0">
          <div className="flex flex-col h-full overflow-hidden gap-5 relative">
            <DialogHeader className="px-5">
              <DialogTitle>{t('tabel')}</DialogTitle>
            </DialogHeader>
            <TabelForm
              budjetId={budjetId}
              mainSchetId={mainSchetId}
              onSubmit={createTabel}
              isPending={isCreating}
            />
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
