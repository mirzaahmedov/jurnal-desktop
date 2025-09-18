import { WarehouseInternalViewDialog } from '@/app/jur_7/internal/view-dialog'
import { WarehousePrixodViewDialog } from '@/app/jur_7/prixod/view-dialog'
import { WarehouseRasxodViewDialog } from '@/app/jur_7/rasxod/view-dialog'
import { MaterialMonitoringType } from '@/common/models'

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
    case MaterialMonitoringType.rasxod:
      return <WarehouseRasxodViewDialog {...props} />
    case MaterialMonitoringType.prixod:
      return <WarehousePrixodViewDialog {...props} />
    case MaterialMonitoringType.internal:
      return <WarehouseInternalViewDialog {...props} />

    default:
      return null
  }
}
