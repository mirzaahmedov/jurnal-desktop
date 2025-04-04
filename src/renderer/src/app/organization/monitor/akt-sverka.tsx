import { Download } from 'lucide-react'

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

import { createShartnomaSpravochnik } from '../shartnoma'

interface AktSverkaDialogProps {
  from: string
  to: string
  schetId: number
  organId: number
}
export const AktSverkaDialog = ({ from, to, schetId, organId }: AktSverkaDialogProps) => {
  const shartnomaSpravochnik = useSpravochnik(
    createShartnomaSpravochnik({
      params: {
        organ_id: organId
      }
    })
  )
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost">
          <Download className="btn-icon icon-start" /> Акт сверки
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Загрузить акт сверки</DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-2">
          <Label htmlFor="shartnoma">Договор (Необязательный)</Label>
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
            url="organization/monitoring/akt/sverka"
            params={{
              main_schet_id: schetId,
              organ_id: organId,
              contract_id: shartnomaSpravochnik.selected?.id || undefined,
              from,
              to,
              excel: true
            }}
            buttonText="Загрузить"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
