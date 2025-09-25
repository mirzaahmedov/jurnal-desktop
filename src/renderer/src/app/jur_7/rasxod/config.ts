import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const WarehouseRasxodQueryKeys = {
  getAll: 'jur7_rasxod/all',
  getById: 'jur7_rasxod/get',
  create: 'jur7_rasxod/create',
  update: 'jur7_rasxod/update',
  delete: 'jur7_rasxod/delete'
}

export const defaultProvodkaValues: RasxodProvodkaFormValues = {
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
export const defaultValues: RasxodFormValues = {
  type_document: 1,
  doc_num: '',
  doc_date: '',
  opisanie: '',
  doverennost: '',
  kimga_id: 0,
  kimdan_id: 0,
  childs: [defaultProvodkaValues]
}

export const RasxodProvodkaFormSchema = withPreprocessor(
  z.object({
    naimenovanie_tovarov_jur7_id: z.union([z.number(), z.string()]),
    name: z.string().optional().nullable(),
    group_number: z.string().optional().nullable(),
    edin: z.string().optional().nullable(),
    inventar_num: z.string().optional().nullable(),
    serial_num: z.string().optional().nullable(),
    kol: z.number().catch(0),
    group_jur7_id: z.number(),
    max_kol: z.number().optional(),
    sena: z.number().catch(0),
    summa: z.number().catch(0),
    debet_schet: z.string(),
    debet_sub_schet: z.string(),
    kredit_schet: z.string(),
    kredit_sub_schet: z.string(),
    iznos: z.boolean().optional(),
    iznos_summa: z.number().optional(),
    iznos_schet: z.string().optional(),
    iznos_sub_schet: z.string().optional(),
    data_pereotsenka: z.string().optional(),
    prixod_dates: z.array(z.object({ date: z.string() })).optional()
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
    kimga_id: z.number().nullable().optional(),
    childs: z.array(RasxodProvodkaFormSchema).superRefine((childs, ctx) => {
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
export type RasxodProvodkaFormValues = z.infer<typeof RasxodProvodkaFormSchema>
