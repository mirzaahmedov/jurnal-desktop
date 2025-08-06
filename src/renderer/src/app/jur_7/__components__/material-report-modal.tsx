import type { DialogTriggerProps } from 'react-aria-components'

import { useTranslation } from 'react-i18next'

import { createOperatsiiSpravochnik } from '@/app/super-admin/operatsii'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Label } from '@/common/components/ui/label'
import { DownloadFile } from '@/common/features/file'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { TypeSchetOperatsii } from '@/common/models'

import { createResponsibleSpravochnik } from '../responsible/service'

export interface MaterialReportModalProps extends Omit<DialogTriggerProps, 'children'> {
  withDefault?: boolean
  withIznos?: boolean
  main_schet_id: number
  budjet_id: number
  to: string
  from: string
  year: number
  month: number
}
export const MaterialReportModal = ({
  withDefault = true,
  withIznos = false,
  isOpen,
  onOpenChange,
  budjet_id,
  main_schet_id,
  to,
  from,
  year,
  month
}: MaterialReportModalProps) => {
  const { t } = useTranslation(['app'])

  const responsibleSpravochnik = useSpravochnik(createResponsibleSpravochnik({}))
  const operatsiiSpravochnik = useSpravochnik(
    createOperatsiiSpravochnik({ params: { type_schet: TypeSchetOperatsii.JUR7 } })
  )

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
          <div className="flex flex-col gap-2 mt-2.5">
            <Label className="font-medium">{t('responsible')}</Label>
            <SpravochnikInput
              {...responsibleSpravochnik}
              placeholder={t('responsible')}
              getInputValue={(selected) => selected?.fio ?? '-'}
            />
            <Label className="font-medium">{t('operatsii')}</Label>
            <SpravochnikInput
              {...operatsiiSpravochnik}
              placeholder={t('operatsii')}
              getInputValue={(selected) =>
                selected ? `${selected.schet} (${selected.schet6 ?? ''}) - ${selected.name}` : '-'
              }
            />
          </div>
          <DialogFooter>
            {withDefault && (
              <DownloadFile
                fileName={`${t('material')}_${to}:${from}.xlsx`}
                url="/jur_7/monitoring/material/report"
                params={{
                  to,
                  from,
                  year,
                  month,
                  budjet_id,
                  main_schet_id,
                  responsible_id: responsibleSpravochnik.selected?.id || undefined,
                  schet: operatsiiSpravochnik.selected?.schet || undefined,
                  excel: true
                }}
                buttonText={t('material')}
              />
            )}
            {withIznos && (
              <DownloadFile
                fileName={`${t('material')}_${t('iznos')}_${to}:${from}.xlsx`}
                url="/jur_7/monitoring/material/report"
                params={{
                  to,
                  from,
                  year,
                  month,
                  budjet_id,
                  main_schet_id,
                  responsible_id: responsibleSpravochnik.selected?.id || undefined,
                  schet: operatsiiSpravochnik.selected?.schet || undefined,
                  excel: true,
                  iznos: true
                }}
                buttonText={`${t('material')} (${t('iznos')})`}
              />
            )}
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
