import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/common/components/ui/dialog'
import { Label } from '@/common/components/ui/label'
import { DownloadFile } from '@/common/features/file'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

import { createShartnomaSpravochnik } from '../../shartnoma'

interface AktSverkiDialogProps {
  from: string
  to: string
  budjetId?: number
  mainSchetId: number
  schetId: number
  organId: number
}
export const AktSverkiDialog = ({
  from,
  to,
  budjetId,
  mainSchetId,
  schetId,
  organId
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Download className="btn-icon" />
          {t('akt_sverki')}
        </Button>
      </DialogTrigger>
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
              `№${selected?.doc_num ?? ''} - ${selected?.doc_date ?? ''}`
            }
          />
        </div>

        <DialogFooter>
          <DownloadFile
            fileName={`акт-сверки-${from}&${to}${shartnomaSpravochnik.selected?.doc_num ? `_договор-№${shartnomaSpravochnik.selected.doc_num}` : ''}.xlsx`}
            url="/152/monitoring/akt/sverka"
            params={{
              budjet_id: budjetId,
              main_schet_id: mainSchetId,
              schet_id: schetId,
              organ_id: organId,
              contract_id: shartnomaSpravochnik.selected?.id || undefined,
              from,
              to,
              excel: true
            }}
            buttonText={t('download')}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
