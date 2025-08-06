import type { DialogTriggerProps } from 'react-aria-components'

import { useTranslation } from 'react-i18next'

import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { DownloadFile } from '@/common/features/file'

export interface MaterialReportModalProps extends Omit<DialogTriggerProps, 'children'> {
  main_schet_id: number
  budjet_id: number
  region_id: number
  to: string
  from: string
  year: number
  month: number
}
export const MaterialReportModal = ({
  isOpen,
  onOpenChange,
  budjet_id,
  main_schet_id,
  region_id,
  to,
  from,
  year,
  month
}: MaterialReportModalProps) => {
  const { t } = useTranslation(['app'])

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setTimeout(() => {
            document.body.style.pointerEvents = 'all'
          }, 500)
        }
        onOpenChange?.(open)
      }}
    >
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('material')}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DownloadFile
              fileName={`${t('material')}_${to}:${from}.xlsx`}
              url="admin/jur7/material/report"
              params={{
                to,
                from,
                year,
                month,
                region_id,
                budjet_id,
                main_schet_id,
                excel: true
              }}
              buttonText={t('material')}
            />
            <DownloadFile
              fileName={`${t('material')}_${t('iznos')}_${to}:${from}.xlsx`}
              url="admin/jur7/material/report"
              params={{
                to,
                from,
                year,
                month,
                region_id,
                budjet_id,
                main_schet_id,
                excel: true,
                iznos: true
              }}
              buttonText={`${t('material')} (${t('iznos')})`}
            />
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
