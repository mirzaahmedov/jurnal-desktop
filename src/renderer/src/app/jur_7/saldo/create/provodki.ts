import type { MaterialCreateProvodkaFormValues } from './config'
import type { EditableColumnDef } from '@/common/components/editable-table'

import {
  createDateEditor,
  createEdinEditor,
  createGroupEditor,
  createNumberEditor,
  createResponsibleEditor,
  createTextEditor
} from '@/common/components/editable-table/editors'

export const provodkiColumns: EditableColumnDef<MaterialCreateProvodkaFormValues>[] = [
  {
    key: 'responsible_id',
    header: 'responsible',
    Editor: createResponsibleEditor(),
    minWidth: 300
  },
  {
    key: 'group_jur7_id',
    header: 'group',
    Editor: createGroupEditor(),
    minWidth: 120
  },
  {
    key: 'name',
    Editor: createTextEditor({
      key: 'name'
    }),
    minWidth: 300
  },
  {
    key: 'edin',
    header: 'ei',
    minWidth: 160,
    Editor: createEdinEditor({
      key: 'edin'
    })
  },
  {
    key: 'serial_num',
    header: 'serial-num',
    minWidth: 160,
    Editor: createTextEditor({
      key: 'serial_num'
    })
  },
  {
    key: 'inventar_num',
    header: 'inventar-num',
    minWidth: 160,
    Editor: createTextEditor({
      key: 'inventar_num'
    })
  },
  {
    key: 'kol',
    Editor: createNumberEditor({
      key: 'kol',
      inputProps: {
        adjustWidth: true
      }
    })
  },
  {
    key: 'summa',
    Editor: createNumberEditor({
      key: 'summa',
      inputProps: {
        adjustWidth: true
      }
    })
  },
  {
    key: 'doc_num',
    minWidth: 140,
    Editor: createTextEditor({
      key: 'doc_num'
    })
  },
  {
    key: 'doc_date',
    minWidth: 140,
    Editor: createDateEditor({
      key: 'doc_date'
    })
  },
  {
    key: 'iznos_start',
    header: 'iznos_start_date',
    minWidth: 140,
    Editor: createDateEditor({
      key: 'iznos_start'
    })
  },
  {
    key: 'eski_iznos_summa',
    header: 'iznos_summa_old',
    minWidth: 160,
    Editor: createNumberEditor({
      key: 'eski_iznos_summa',
      inputProps: {
        adjustWidth: true
      }
    })
  }
]
