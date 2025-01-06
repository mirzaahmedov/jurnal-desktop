import { NumericInput, inputVariants } from '@renderer/common/components'
import {
  createNumberEditor,
  createSmetaGrafikEditor
} from '@/common/features/editable-table/editors'

import type { EditableColumnType } from '@/common/features/editable-table'
import type { OXReportProvodka } from '../config'
import { SmetaGrafik } from '@renderer/common/models'

const getMonthAllocated = (month?: number, smeta?: SmetaGrafik) => {
  if (!month || !smeta) {
    return 0
  }
  return smeta['oy_' + month]
}

const provodkaColumns: EditableColumnType<OXReportProvodka>[] = [
  {
    key: 'smeta_grafik_id',
    header: 'Смета',
    Editor: createSmetaGrafikEditor()
  },
  {
    key: 'ajratilgan_mablag',
    header: 'Ажратилган маблаг',
    Editor: ({ state, params }) => {
      const month = params['month'] as number
      const smeta = state['smeta_grafik'] as SmetaGrafik | undefined

      const value = getMonthAllocated(month, smeta)
      return (
        <div className="relative">
          <NumericInput
            readOnly
            value={value}
            className={inputVariants({ editor: true })}
          />
        </div>
      )
    },
    width: 220
  },
  {
    key: 'tulangan_mablag_smeta_buyicha',
    header: 'Туланган маблаг смета буйича',
    Editor: createNumberEditor({ key: 'tulangan_mablag_smeta_buyicha' }),
    width: 220
  },
  {
    key: 'kassa_rasxod',
    header: 'Касса расход',
    Editor: createNumberEditor({ key: 'kassa_rasxod' }),
    width: 220
  },
  {
    key: 'haqiqatda_harajatlar',
    header: 'Хакикатда расход',
    Editor: createNumberEditor({ key: 'haqiqatda_harajatlar' }),
    width: 220
  },
  {
    key: 'remainder',
    header: 'Колдик',
    Editor: ({ state, params, row }) => {
      const month = params['month'] as number
      const smeta = state['smeta_grafik'] as SmetaGrafik | undefined

      const remainder = getMonthAllocated(month, smeta) - row.kassa_rasxod
      return (
        <div className="relative">
          <NumericInput
            readOnly
            value={remainder}
            className={inputVariants({ editor: true })}
          />
        </div>
      )
    },
    width: 220
  }
]

export { provodkaColumns }
