import type { TabelFormValues } from '../config'
import type { TabelDetailsFormValues } from '../interfaces'
import type { EditableColumnDef } from '@/common/components/editable-table'

import { EditableTable, type EditableTableProps } from '@/common/components/editable-table'
import { createNumberEditor, createTextEditor } from '@/common/components/editable-table/editors'

export const TabelEditableColumnDefs: EditableColumnDef<TabelFormValues, 'tabelChildren'>[] = [
  {
    key: 'fio',
    header: 'employee',
    minWidth: 350,
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
    key: 'otrabDni',
    header: 'worked_days',
    Editor: createNumberEditor({
      key: 'otrabDni'
    })
  },
  {
    key: 'noch',
    header: 'night_shift_hours',
    Editor: createNumberEditor({
      key: 'noch'
    })
  },
  {
    key: 'prazdnik',
    header: 'holiday_hours',
    Editor: createNumberEditor({
      key: 'prazdnik'
    })
  },
  {
    key: 'kazarma',
    header: 'kazarma_hours',
    Editor: createNumberEditor({
      key: 'kazarma'
    })
  },
  {
    key: 'pererabodka',
    header: 'overtime_hours',
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
