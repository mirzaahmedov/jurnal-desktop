import { KassaPrixodViewDialog } from '@/app/jur_1/prixod/view-dialog'
import { KassaRasxodViewDialog } from '@/app/jur_1/rasxod/view-dialog'
import { BankPrixodViewDialog } from '@/app/jur_2/prixod/view-dialog'
import { BankRasxodViewDialog } from '@/app/jur_2/rasxod/view-dialog'
import { PokazatUslugiViewDialog } from '@/app/jur_3/152/pokazat-uslugi/view-dialog'
import { AktViewDialog } from '@/app/jur_3/159/akt/view-dialog'
import { AvansViewDialog } from '@/app/jur_4/avans/view-dialog'
import { WarehouseInternalViewDialog } from '@/app/jur_7/internal/view-dialog'
import { WarehousePrixodViewDialog } from '@/app/jur_7/prixod/view-dialog'
import { WarehouseRasxodViewDialog } from '@/app/jur_7/rasxod/view-dialog'
import { ProvodkaType } from '@/common/models'

export interface ViewModalProps {
  selected: any
  onClose: VoidFunction
}
export const ViewModal = ({ selected, onClose }: ViewModalProps) => {
  const id = selected?.id

  const props = {
    selectedId: id,
    onClose
  }

  switch (selected?.type) {
    case ProvodkaType.BANK_RASXOD:
      return <BankRasxodViewDialog {...props} />
    case ProvodkaType.BANK_PRIXOD:
      return <BankPrixodViewDialog {...props} />
    case ProvodkaType.KASSA_RASXOD:
      return <KassaRasxodViewDialog {...props} />
    case ProvodkaType.KASSA_PRIXOD:
      return <KassaPrixodViewDialog {...props} />
    case ProvodkaType.SHOW_SERVICE:
      return <PokazatUslugiViewDialog {...props} />
    case ProvodkaType.AKT:
      return <AktViewDialog {...props} />
    case ProvodkaType.AVANS:
      return <AvansViewDialog {...props} />
    case ProvodkaType.JUR7_RASXOD:
      return <WarehouseRasxodViewDialog {...props} />
    case ProvodkaType.JUR7_PRIXOD:
      return <WarehousePrixodViewDialog {...props} />
    case ProvodkaType.JUR7_INTERNAL:
      return <WarehouseInternalViewDialog {...props} />

    default:
      return null
  }
}
