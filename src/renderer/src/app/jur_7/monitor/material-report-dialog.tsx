import type { DialogTriggerProps } from 'react-aria-components'

import { useTranslation } from 'react-i18next'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'
import { Label } from '@/common/components/ui/label'
import { DownloadFile } from '@/common/features/file'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

import { createResponsibleSpravochnik } from '../responsible/service'

export interface MaterialReportDialogProps extends Omit<DialogTriggerProps, 'children'> {
  main_schet_id: number
  budjet_id: number
  to: string
  year: number
  month: number
}
export const MaterialReportDialog = ({
  isOpen,
  onOpenChange,
  budjet_id,
  main_schet_id,
  to,
  year,
  month
}: MaterialReportDialogProps) => {
  const { t } = useTranslation(['app'])

  const responsibleSpravochnik = useSpravochnik(createResponsibleSpravochnik({}))

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setTimeout(() => {
            document.body.style.pointerEvents = 'all'
          }, 500)
        }
        onOpenChange?.(open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('material')}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label className="font-medium">{t('responsible')}</Label>
          <SpravochnikInput
            {...responsibleSpravochnik}
            placeholder={t('responsible')}
            getInputValue={(selected) => selected?.fio ?? ''}
          />
        </div>
        <DialogFooter>
          <DownloadFile
            fileName={`${t('material')}_${to}.xlsx`}
            url="/jur_7/monitoring/material/report"
            params={{
              to,
              year,
              month,
              budjet_id,
              main_schet_id,
              responsible_id: responsibleSpravochnik.selected?.id,
              excel: true
            }}
            buttonText={t('material')}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
