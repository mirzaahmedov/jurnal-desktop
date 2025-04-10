import type { EditableColumnDef } from '@/common/components/editable-table'
import type { JUR8MonitorChild } from '@/common/models'

import { createNumberEditor, createTextEditor } from '@/common/components/editable-table/editors'
import { Badge } from '@/common/components/ui/badge'
import { Input } from '@/common/components/ui/input'
import { inputVariants } from '@/common/features/spravochnik'
import { formatLocaleDate } from '@/common/lib/format'

import { JUR8MonitorChildTypeLabels } from './config'

export const JUR8MonitorDetailsColumns: EditableColumnDef<JUR8MonitorChild>[] = [
  {
    key: 'doc_num',
    Editor: createTextEditor({
      readOnly: true,
      key: 'doc_num'
    })
  },
  {
    key: 'doc_date',
    Editor: ({ row }) => {
      return (
        <Input
          readOnly
          value={formatLocaleDate(row.doc_date)}
          className={inputVariants({ editor: true })}
        />
      )
    }
  },
  {
    key: 'schet',
    Editor: createTextEditor({
      readOnly: true,
      key: 'schet'
    })
  },
  {
    key: 'rasxod_schet',
    Editor: createTextEditor({
      readOnly: true,
      key: 'rasxod_schet'
    })
  },
  {
    key: 'summa',
    headerClassName: 'text-right',
    Editor: createNumberEditor({
      readOnly: true,
      key: 'summa'
    })
  },
  {
    key: 'type_doc',
    header: 'type',
    Editor: ({ row }) => {
      return row.type_doc !== '' ? (
        <div className="px-2">
          <Badge>{JUR8MonitorChildTypeLabels[row.type_doc]}</Badge>
        </div>
      ) : null
    }
  }
]
