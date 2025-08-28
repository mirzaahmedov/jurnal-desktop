import type { OrganSaldoFormValues} from '../config'
import type { EditableColumnDef } from '@/common/components/editable-table'

import { createNumberEditor, createTextEditor } from '@/common/components/editable-table/editors'
import { Badge } from '@/common/components/ui/badge'

export const getOrganSaldoProvodkaColumns = (isEditable: boolean): EditableColumnDef<OrganSaldoFormValues, "organizations">[] =>
  [
    {
      key: 'organization_id',
      header: 'id',
      width: 100,
      Editor: createTextEditor({
        key: 'organization_id',
        readOnly: true
      })
    },
    {
      key: 'name',
      Editor: createTextEditor({
        key: 'name',
        readOnly: true
      })
    },
    {
      key: 'bank_klient',
      header: 'bank',
      Editor: createTextEditor({
        key: 'bank_klient',
        readOnly: true
      })
    },
    {
      width: 100,
      key: 'mfo',
      Editor: createTextEditor({
        key: 'mfo',
        readOnly: true
      })
    },
    {
      width: 160,
      key: 'inn',
      Editor: createTextEditor({
        key: 'inn',
        readOnly: true
      })
    },
    {
      width: 250,
      key: 'prixod',
      Editor: createNumberEditor({
        key: 'prixod',
        defaultValue: 0,
        readOnly: !isEditable
      })
    },
    {
      width: 250,
      key: 'rasxod',
      Editor: createNumberEditor({
        key: 'rasxod',
        defaultValue: 0,
        readOnly: !isEditable
      })
    },
    {
      key: "sub_childs",
      header: " ",
      Editor: ({ row }) => {
        const count = row.sub_childs?.length ?? 0;
        return (
          <div className='px-2.5'> 
            <Badge variant={count > 0 ? "default" : "secondary"}>{count}</Badge>
          </div>
        )
      }
    }
  ]
