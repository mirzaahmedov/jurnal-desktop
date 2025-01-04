import {
  createNumberEditor,
  createSmetaGrafikEditor
} from '@/common/features/editable-table/editors'

import type { EditableColumnType } from '@/common/features/editable-table'
import { Input } from '@renderer/common/components/ui/input'
import type { OXReportProvodka } from '../config'
import { inputVariants } from '@renderer/common/components'

const provodkaColumns: EditableColumnType<OXReportProvodka>[] = [
  {
    key: 'smeta_grafik_id',
    header: 'Смета',
    Editor: createSmetaGrafikEditor()
  },
  {
    key: 'debet_sum',
    header: 'Дебет',
    Editor: createNumberEditor({ key: 'allocated_amount' }),
    width: 320
  },
  {
    key: 'kredit_sum',
    header: 'Кредит',
    Editor: createNumberEditor({ key: 'kassa_rasxod' }),
    width: 320
  },
  {
    key: 'remainder',
    header: 'Колдик',
    Editor: ({ row }) => {
      const remainder = row.allocated_amount - row.kassa_rasxod
      return (
        <div className="relative">
          <Input
            readOnly
            value={remainder}
            className={inputVariants({ editor: true })}
          />
        </div>
      )
    }
  }
]

export { provodkaColumns }
