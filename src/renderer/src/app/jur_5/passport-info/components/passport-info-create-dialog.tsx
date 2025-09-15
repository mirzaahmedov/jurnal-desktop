import type { VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import type { MainZarplata } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useTranslation } from 'react-i18next'

import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { capitalize } from '@/common/lib/string'

import { MainZarplataForm } from './main-zarplata-form'

export interface PassportInfoCreateDialogProps extends Omit<DialogTriggerProps, 'children'> {
  vacant: VacantTreeNode
  selectedUser: MainZarplata | undefined
  onCreateSuccess?: (user: MainZarplata) => void
}
export const PassportInfoCreateDialog = ({
  vacant,
  selectedUser,
  onCreateSuccess,
  ...props
}: PassportInfoCreateDialogProps) => {
  const { t } = useTranslation(['app'])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="max-w-9xl h-full max-h-[800px]">
          <div className="h-full flex flex-col space-y-5 overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                {capitalize(t('create-something', { something: t('pages.passport_details') }))}
              </DialogTitle>
            </DialogHeader>

            <div className="min-h-0 flex-1 overflow-hidden">
              <MainZarplataForm
                vacant={vacant}
                selectedMainZarplata={selectedUser}
                onCreate={onCreateSuccess}
                onClose={() => props?.onOpenChange?.(false)}
              />
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
