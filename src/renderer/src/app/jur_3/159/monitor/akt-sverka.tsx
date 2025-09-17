import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/common/components/jolly/button'
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
import { formatLocaleDate } from '@/common/lib/format'

import { createShartnomaSpravochnik } from '../../shartnoma'

interface AktSverkiDialogProps {
  from: string
  to: string
  budjetId?: number
  mainSchetId: number
  reportTitleId: number
  schetId: number
  organId: number
  year: number
  month: number
}
export const AktSverkiDialog = ({
  from,
  to,
  budjetId,
  mainSchetId,
  reportTitleId,
  schetId,
  organId,
  year,
  month
}: AktSverkiDialogProps) => {
  const { t } = useTranslation()

  const shartnomaSpravochnik = useSpravochnik(
    createShartnomaSpravochnik({
      params: {
        organ_id: organId
      }
    })
  )

  return (
    <DialogTrigger>
      <DialogTrigger>
        <Button
          variant="ghost"
          IconStart={Download}
        >
          {t('akt_sverki')}
        </Button>
      </DialogTrigger>
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('akt_sverki')}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-2">
            <Label htmlFor="shartnoma">
              {t('shartnoma')} ({t('optional')})
            </Label>
            <SpravochnikInput
              {...shartnomaSpravochnik}
              getInputValue={(selected) =>
                `№${selected?.doc_num ?? ''} - ${formatLocaleDate(selected?.doc_date ?? '')}`
              }
            />
          </div>

          <DialogFooter>
            <DownloadFile
              fileName={`акт-сверки-${from}&${to}${shartnomaSpravochnik.selected?.doc_num ? `_договор-№${shartnomaSpravochnik.selected.doc_num}` : ''}.xlsx`}
              url="/159/monitoring/akt-sverka"
              params={{
                budjet_id: budjetId,
                main_schet_id: mainSchetId,
                report_title_id: reportTitleId,
                schet_id: schetId,
                organ_id: organId,
                contract_id: shartnomaSpravochnik.selected?.id || undefined,
                from,
                to,
                year,
                month,
                excel: true
              }}
              buttonText={t('download')}
            />
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
