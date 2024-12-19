import type { ColumnDef } from '@/common/components'
import type { InternalTransfer } from '@/common/models'
import { withPreprocessor } from '@/common/lib/validation'
import { z } from 'zod'

const queryKeys = {
  getAll: 'jur7_internal/all',
  get: 'jur7_internal/get',
  create: 'jur7_internal/create',
  update: 'jur7_internal/update',
  delete: 'jur7_internal/delete'
}

const defaultValues: InternalTransferFormType = {
  type_document: 1,
  doc_num: '',
  doc_date: '',
  opisanie: '',
  kimdan_id: 0,
  kimga_id: 0,
  childs: [
    {
      naimenovanie_tovarov_jur7_id: 0,
      kol: 0,
      sena: 0,
      summa: 0,
      debet_schet: '',
      debet_sub_schet: '',
      kredit_schet: '',
      kredit_sub_schet: '',
      data_pereotsenka: ''
    }
  ]
}

const InternalTransferChildFormSchema = withPreprocessor(
  z.object({
    naimenovanie_tovarov_jur7_id: z.number(),
    kol: z.number(),
    sena: z.number(),
    summa: z.number(),
    debet_schet: z.string(),
    debet_sub_schet: z.string(),
    kredit_schet: z.string(),
    kredit_sub_schet: z.string(),
    data_pereotsenka: z.string()
  })
)
const InternalTransferFormSchema = withPreprocessor(
  z.object({
    type_document: z.number().optional(),
    doc_num: z.string(),
    doc_date: z.string(),
    opisanie: z.string().optional(),
    kimdan_id: z.number(),
    kimga_id: z.number(),
    childs: z.array(InternalTransferChildFormSchema)
  })
)
type InternalTransferFormType = z.infer<typeof InternalTransferFormSchema>
type InternalTransferChildFormType = z.infer<typeof InternalTransferChildFormSchema>

const columns: ColumnDef<InternalTransfer>[] = [
  {
    key: 'doc_num',
    header: '№ документа'
  },
  {
    key: 'doc_date',
    header: 'Дата документа'
  },
  {
    key: 'kimdan_name',
    header: 'Кимдан'
  },
  {
    key: 'kimga_name',
    header: 'Кимга'
  },
  {
    key: 'summa',
    header: 'Сумма'
  },
  {
    key: 'opisanie',
    header: 'Описание'
  }
]

export {
  queryKeys,
  defaultValues,
  columns,
  InternalTransferFormSchema,
  InternalTransferChildFormSchema
}
export type { InternalTransferFormType, InternalTransferChildFormType }
