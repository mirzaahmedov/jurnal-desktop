import type { KassaMonitoringType } from '@/common/models'

import { KassaPrixodViewDialog } from '../prixod/view-dialog'
import { KassaRasxodViewDialog } from '../rasxod/view-dialog'

export interface ViewModalProps {
  selected: KassaMonitoringType | null
  onClose: VoidFunction
}
export const ViewModal = ({ selected, onClose }: ViewModalProps) => {
  return (
    <>
      {selected ? (
        selected.prixod_sum ? (
          <KassaPrixodViewDialog
            selectedId={selected.id}
            onClose={onClose}
          />
        ) : (
          <KassaRasxodViewDialog
            selectedId={selected.id}
            onClose={onClose}
          />
        )
      ) : null}
    </>
  )
}
