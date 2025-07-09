import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const WarehouseInternalQueryKeys = {
  getAll: 'jur7_internal/all',
  getById: 'jur7_internal/get',
  create: 'jur7_internal/create',
  update: 'jur7_internal/update',
  delete: 'jur7_internal/delete'
}

export const defaultValues: InternalFormValues = {
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
      data_pereotsenka: '',
      prixod_dates: []
    }
  ]
}

export const InternalProvodkaFormSchema = withPreprocessor(
  z.object({
    naimenovanie_tovarov_jur7_id: z.union([z.string(), z.number()]),
    name: z.string().optional().nullable(),
    group_number: z.string().optional().nullable(),
    edin: z.string().optional().nullable(),
    inventar_num: z.string().optional().nullable(),
    serial_num: z.string().optional().nullable(),
    kol: z.number().min(0),
    group_jur7_id: z.number(),
    max_kol: z.number().optional(),
    sena: z.number().catch(0),
    summa: z.number().catch(0),
    iznos: z.boolean().optional(),
    iznos_start: z.string().optional(),
    iznos_summa: z.number().optional(),
    iznos_schet: z.string().optional(),
    iznos_sub_schet: z.string().optional(),
    debet_schet: z.string(),
    debet_sub_schet: z.string(),
    kredit_schet: z.string(),
    kredit_sub_schet: z.string(),
    data_pereotsenka: z.string(),
    prixod_dates: z.array(z.object({ date: z.string() })).optional()
  })
)
export const InternalFormSchema = withPreprocessor(
  z.object({
    type_document: z.number().optional(),
    doc_num: z.string(),
    doc_date: z.string(),
    opisanie: z.string().optional(),
    kimdan_id: z.number(),
    kimga_id: z.number(),
    childs: z.array(InternalProvodkaFormSchema).superRefine((childs, ctx) => {
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
export type InternalFormValues = z.infer<typeof InternalFormSchema>
export type InternalProvodkaFormValues = z.infer<typeof InternalProvodkaFormSchema>
