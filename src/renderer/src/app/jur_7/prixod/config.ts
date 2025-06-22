import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const WarehousePrixodQueryKeys = {
  getAll: 'warehouse_prixod/all',
  getById: 'warehouse_prixod/get',
  create: 'warehouse_prixod/create',
  update: 'warehouse_prixod/update',
  delete: 'warehouse_prixod/delete'
}

export const defaultValues: PrixodFormValues = {
  type_document: 1,
  doc_num: '',
  doc_date: '',
  opisanie: '',
  doverennost: '',
  kimdan_id: 0,
  kimga_id: 0,
  id_shartnomalar_organization: 0,
  organization_by_raschet_schet_id: 0,
  childs: [
    {
      name: '',
      unit_id: 0,
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

export const PrixodProvodkaFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    unit_id: z.number(),
    group_jur7_id: z.number(),
    group_number: z.string().optional().nullable(),
    inventar_num: z.string().optional(),
    serial_num: z.string().optional(),
    kol: z.number(),
    sena: z.number().default(0),
    summa: z.number().default(0),
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
    data_pereotsenka: z.string(),
    // when adding to existing product
    product_id: z.number().optional(),
    saldo_id: z.number().optional()
  })
).superRefine((values, ctx) => {
  if (values.iznos) {
    if (!values.iznos_start) {
      ctx.addIssue({
        code: 'custom',
        path: ['iznos_start']
      })
    }
  }
})
export const PrixodFormSchema = withPreprocessor(
  z.object({
    type_document: z.number().optional(),
    doc_num: z.string(),
    doc_date: z.string(),
    opisanie: z.string().optional(),
    doverennost: z.string().optional(),
    kimdan_id: z.number(),
    kimga_id: z.number(),
    id_shartnomalar_organization: z.number().optional(),
    organization_by_raschet_schet_id: z.number(),
    organization_by_raschet_schet_gazna_id: z.number().optional(),
    shartnoma_grafik_id: z.number().optional(),
    childs: z.array(PrixodProvodkaFormSchema)
  })
)
export type PrixodFormValues = z.infer<typeof PrixodFormSchema>
export type PrixodProvodkaFormValues = z.infer<typeof PrixodProvodkaFormSchema>
