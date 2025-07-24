import type { TabelDetailsFormValues } from '../interfaces'
import type { EditableColumnDef } from '@/common/components/editable-table'
import type { TabelProvodka } from '@/common/models/tabel'

import { EditableTable, type EditableTableProps } from '@/common/components/editable-table'
import { createNumberEditor, createTextEditor } from '@/common/components/editable-table/editors'

export const TabelEditableColumnDefs: EditableColumnDef<TabelProvodka>[] = [
  {
    key: 'fio',
    header: 'employee',
    minWidth: 230,
    Editor: createTextEditor({
      key: 'mainZarplataName',
      readOnly: true
    })
  },
  {
    key: 'doljnost',
    minWidth: 230,
    Editor: createTextEditor({
      key: 'doljnost',
      readOnly: true
    })
  },
  {
    key: 'rabDni',
    header: 'workdays',
    Editor: createNumberEditor({
      key: 'rabDni'
    })
  },
  {
    key: 'prazdnik',
    header: 'holiday',
    Editor: createNumberEditor({
      key: 'prazdnik'
    })
  },
  {
    key: 'kazarma',
    header: 'kazarma',
    Editor: createNumberEditor({
      key: 'kazarma'
    })
  },
  {
    key: 'noch',
    header: 'night_shift',
    Editor: createNumberEditor({
      key: 'noch'
    })
  },
  {
    key: 'otrabDni',
    header: 'worked_days',
    Editor: createNumberEditor({
      key: 'otrabDni'
    })
  },
  {
    key: 'pererabodka',
    header: 'overtime',
    Editor: createNumberEditor({
      key: 'pererabodka'
    })
  }
]

export const TabelProvodkaEditableTable = (
  props: Omit<EditableTableProps<TabelDetailsFormValues, 'children'>, 'columnDefs' | 'name'>
) => {
  return (
    <EditableTable
      columnDefs={TabelEditableColumnDefs as any}
      name="children"
      {...props}
    />
  )
}
