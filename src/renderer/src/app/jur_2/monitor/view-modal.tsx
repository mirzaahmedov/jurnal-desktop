import type { BankMonitoring } from '@/common/models'

import { BankPrixodViewDialog } from '../prixod/view-dialog'
import { BankRasxodViewDialog } from '../rasxod/view-dialog'

export interface ViewModalProps {
  selected: BankMonitoring | null
  onClose: VoidFunction
}
export const ViewModal = ({ selected, onClose }: ViewModalProps) => {
  return (
    <>
      {selected ? (
        selected.prixod_sum ? (
          <BankPrixodViewDialog
            selectedId={selected.id}
            onClose={onClose}
          />
        ) : (
          <BankRasxodViewDialog
            selectedId={selected.id}
            onClose={onClose}
          />
        )
      ) : null}
    </>
  )
}
