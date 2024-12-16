import { DownloadDocumentButton, SpravochnikInput } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'
import { Download } from 'lucide-react'
import { useSpravochnik } from '@/common/features/spravochnik'
import { createShartnomaSpravochnik } from '../shartnoma'
import { Label } from '@/common/components/ui/label'

type AktSverkaDialogProps = {
  from: string
  to: string
  schetId: number
  orgId: number
}
const AktSverkaDialog = ({ from, to, schetId, orgId }: AktSverkaDialogProps) => {
  const shartnomaSpravochnik = useSpravochnik(createShartnomaSpravochnik({}))
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
            id="shartnoma"
            name="shartnoma"
            value={`№${shartnomaSpravochnik.selected?.doc_num ?? ''} - ${shartnomaSpravochnik.selected?.doc_date ?? ''}`}
            onDoubleClick={shartnomaSpravochnik.open}
            onClear={shartnomaSpravochnik.clear}
          />
        </div>

        <DialogFooter>
          <DownloadDocumentButton
            fileName={`акт-сверки-${from}:${to}${shartnomaSpravochnik.selected?.doc_num ? `_договор-№${shartnomaSpravochnik.selected.doc_num}` : ''}.xlsx`}
            url="organization/monitoring/akt/sverka"
            params={{
              main_schet_id: schetId,
              organ_id: orgId,
              contract_id: shartnomaSpravochnik.selected?.id || undefined,
              from,
              to
            }}
            buttonText="Загрузить"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { AktSverkaDialog }
