import type { ColumnDef } from '@/common/components'
import type { InternalTransfer } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { formatLocaleDate } from '@renderer/common/lib/format'
import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

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
      group_jur7_id: 0,
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
    name: z.string().optional().nullable(),
    group_number: z.string().optional().nullable(),
    edin: z.string().optional().nullable(),
    inventar_num: z.string().optional().nullable(),
    serial_num: z.string().optional().nullable(),
    kol: z.number(),
    group_jur7_id: z.number(),
    max_kol: z.number().optional(),
    sena: z.number(),
    summa: z.number().min(1),
    iznos: z.boolean().optional(),
    iznos_start: z.string().optional(),
    eski_iznos_summa: z.number().optional(),
    iznos_schet: z.string().optional(),
    iznos_sub_schet: z.string().optional(),
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
    childs: z.array(InternalTransferChildFormSchema).superRefine((childs, ctx) => {
      childs.forEach((child, index) => {
        if (child.max_kol && child.kol > child.max_kol) {
          ctx.addIssue({
            code: 'custom',
            message: 'Product quantity exceeds available quantity of products',
            path: [index, 'kol']
          })
          delete child.max_kol
        }
      })
    })
  })
)
type InternalTransferFormType = z.infer<typeof InternalTransferFormSchema>
type InternalTransferChildFormType = z.infer<typeof InternalTransferChildFormSchema>

const columns: ColumnDef<InternalTransfer>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'doc_num'
  },
  {
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    key: 'kimdan_name',
    header: 'from-who'
  },
  {
    key: 'kimga',
    header: 'to-whom',
    renderCell: (row) => row?.kimga?.fio
  },
  {
    numeric: true,
    key: 'summa'
  },
  {
    key: 'opisanie'
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
