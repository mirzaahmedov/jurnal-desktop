import type { TabelDetailsFormValues } from '../interfaces'
import type { EditableColumnDef } from '@/common/components/editable-table'
import type { TabelProvodka } from '@/common/models/tabel'

import { EditableTable, type EditableTableProps } from '@/common/components/editable-table'
import { createNumberEditor } from '@/common/components/editable-table/editors'
import { createMainZarplataEditor } from '@/common/components/editable-table/editors/main-zarplata'

export const columnDefs: EditableColumnDef<TabelProvodka>[] = [
  {
    key: 'mainZarplataId',
    header: 'employee',
    width: 400,
    Editor: createMainZarplataEditor({
      withDoljnostName: true
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

export const TabelProvodkaEditableTable = ({
  rowIndex,
  ...props
}: Omit<EditableTableProps<TabelDetailsFormValues, 'values'>, 'columnDefs' | 'name'> & {
  rowIndex: number
}) => {
  return (
    <EditableTable
      columnDefs={columnDefs as any}
      name={`values.${rowIndex}.children` as any}
      {...props}
    />
  )
}
