import type { WorkTripProvodkaFormValues } from '../config'
import type { EditableColumnDef } from '@/common/components/editable-table'

import { useTranslation } from 'react-i18next'

import {
  createNumberEditor,
  createOperatsiiEditor
} from '@/common/components/editable-table/editors'
import { Input } from '@/common/components/ui/input'
import { TypeSchetOperatsii } from '@/common/models'

export const WorkTripProvodkaColumns: EditableColumnDef<WorkTripProvodkaFormValues>[] = [
  {
    key: 'schet_id',
    header: 'operatsii',
    Editor: createOperatsiiEditor({
      type_schet: TypeSchetOperatsii.AVANS_OTCHET,
      field: 'schet_id'
    })
  },
  {
    key: 'summa',
    Editor: createNumberEditor({
      key: 'summa',
      readOnly: true
    })
  },
  {
    key: 'type',
    Editor: ({ value }) => {
      const { t } = useTranslation()
      return (
        <Input
          value={t(value as string)}
          readOnly
          editor
        />
      )
    }
  }
]
