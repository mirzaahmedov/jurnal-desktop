import type { ColumnDef } from '@/common/components'
import type { AdditionalDocument } from '@/common/models/additional-documents'

export const AdditionalDocumentColumnDefs: ColumnDef<AdditionalDocument>[] = [
  {
    key: 'docNum',
    header: 'doc_num'
  },
  {
    key: 'typesName',
    header: 'name'
  },
  {
    key: 'typeName',
    header: 'type'
  },
  {
    key: 'razmer',
    header: 'size'
  },
  {
    key: 'elements',
    header: 'listed_accruals'
  }
]
