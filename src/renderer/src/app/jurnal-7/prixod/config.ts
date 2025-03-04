import type { ColumnDef } from '@/common/components'
import type { MO7Prixod } from '@/common/models'

import { IDCell } from '@renderer/common/components/table/renderers/id'
import { formatLocaleDate } from '@renderer/common/lib/format'
import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const queryKeys = {
  getAll: 'jur7_prixod/all',
  get: 'jur7_prixod/get',
  create: 'jur7_prixod/create',
  update: 'jur7_prixod/update',
  delete: 'jur7_prixod/delete'
}

export const defaultValues: PrixodFormType = {
  type_document: 1,
  doc_num: '',
  doc_date: '',
  j_o_num: '',
  opisanie: '',
  doverennost: '',
  kimdan_id: 0,
  kimga_id: 0,
  id_shartnomalar_organization: 0,
  organization_by_raschet_schet_id: 0,
  childs: [
    {
      name: '',
      edin: '',
      group_jur7_id: 0,
      inventar_num: '',
      serial_num: '',
      kol: 0,
      sena: 0,
      nds_foiz: 0,
      summa: 0,
      iznos: false,
      eski_iznos_summa: 0,
      debet_schet: '',
      debet_sub_schet: '',
      kredit_schet: '',
      kredit_sub_schet: '',
      data_pereotsenka: ''
    }
  ]
}

export const PrixodChildFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    edin: z.string(),
    group_jur7_id: z.number(),
    inventar_num: z.string(),
    serial_num: z.string(),
    kol: z.number(),
    sena: z.number(),
    summa: z.number().min(1),
    nds_foiz: z.number().optional(),
    iznos: z.boolean(),
    eski_iznos_summa: z.number().optional(),
    iznos_schet: z.string().optional(),
    iznos_sub_schet: z.string().optional(),
    iznos_start: z.string().optional(),
    debet_schet: z.string(),
    debet_sub_schet: z.string(),
    kredit_schet: z.string(),
    kredit_sub_schet: z.string(),
    data_pereotsenka: z.string()
  })
).superRefine((values, ctx) => {
  if (values.iznos) {
    if (!values.iznos_start) {
      ctx.addIssue({
        code: 'custom',
        path: ['iznos_start']
      })
    }
    if (!values.iznos_schet) {
      ctx.addIssue({
        code: 'custom',
        path: ['iznos_schet']
      })
    }
    if (!values.iznos_sub_schet) {
      ctx.addIssue({
        code: 'custom',
        path: ['iznos_sub_schet']
      })
    }
  }
})
export const PrixodFormSchema = withPreprocessor(
  z.object({
    type_document: z.number().optional(),
    doc_num: z.string(),
    doc_date: z.string(),
    j_o_num: z.string(),
    opisanie: z.string().optional(),
    doverennost: z.string().optional(),
    kimdan_id: z.number(),
    kimga_id: z.number(),
    id_shartnomalar_organization: z.number().optional(),
    organization_by_raschet_schet_id: z.number(),
    organization_by_raschet_schet_gazna_id: z.number().optional(),
    shartnoma_grafik_id: z.number().optional(),
    childs: z.array(PrixodChildFormSchema)
  })
)
export type PrixodFormType = z.infer<typeof PrixodFormSchema>
export type PrixodChildFormType = z.infer<typeof PrixodChildFormSchema>

export const columns: ColumnDef<MO7Prixod>[] = [
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
    key: 'kimga_name',
    header: 'to-whom'
  },
  {
    numeric: true,
    key: 'summa'
  },
  {
    key: 'opisanie'
  }
]
