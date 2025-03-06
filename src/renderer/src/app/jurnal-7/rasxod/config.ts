import type { ColumnDef } from '@/common/components'
import type { Jur7Rasxod } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { formatLocaleDate } from '@renderer/common/lib/format'
import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const queryKeys = {
  getAll: 'jur7_rasxod/all',
  get: 'jur7_rasxod/get',
  create: 'jur7_rasxod/create',
  update: 'jur7_rasxod/update',
  delete: 'jur7_rasxod/delete'
}

export const defaultChildValues = {
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
export const defaultValues: RasxodFormValues = {
  type_document: 1,
  doc_num: '',
  doc_date: '',
  opisanie: '',
  doverennost: '',
  kimdan_id: 0,
  childs: [defaultChildValues]
}

export const RasxodChildFormSchema = withPreprocessor(
  z.object({
    naimenovanie_tovarov_jur7_id: z.number(),
    name: z.string().optional().nullable(),
    group_number: z.string().optional().nullable(),
    edin: z.string().optional().nullable(),
    inventar_num: z.string().optional().nullable(),
    serial_num: z.string().optional().nullable(),
    kol: z.number(),
    max_kol: z.number().optional(),
    sena: z.number(),
    summa: z.number().min(1),
    debet_schet: z.string(),
    debet_sub_schet: z.string(),
    kredit_schet: z.string(),
    kredit_sub_schet: z.string(),
    iznos: z.boolean().optional(),
    iznos_start: z.string().optional(),
    eski_iznos_summa: z.number().optional(),
    iznos_schet: z.string().optional(),
    iznos_sub_schet: z.string().optional(),
    data_pereotsenka: z.string()
  })
)
export const RasxodFormSchema = withPreprocessor(
  z.object({
    type_document: z.number().optional(),
    doc_num: z.string(),
    doc_date: z.string(),
    opisanie: z.string().optional(),
    doverennost: z.string().optional(),
    kimdan_id: z.number(),
    childs: z.array(RasxodChildFormSchema).superRefine((childs, ctx) => {
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
export type RasxodFormValues = z.infer<typeof RasxodFormSchema>
export type RasxodChildFormValues = z.infer<typeof RasxodChildFormSchema>

export const columns: ColumnDef<Jur7Rasxod>[] = [
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
    numeric: true,
    key: 'summa'
  },
  {
    key: 'opisanie'
  }
]
