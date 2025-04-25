import { z } from 'zod'
import { ZodIssueCode } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export enum RasxodType {
  Podotchet = 'podotchet',
  Zarplata = 'zarplata',
  Organ = 'organ'
}

export const KassaRasxodQueryKeys = {
  getAll: 'kassa-rasxod/all',
  getById: 'kassa-rasxod',
  update: 'kassa-rasxod/update',
  delete: 'kassa-rasxod/delete',
  create: 'kassa-rasxod/create'
}

export const defaultValues: KassaRasxodFormValues = {
  doc_num: '',
  doc_date: '',
  id_podotchet_litso: 0,
  type: RasxodType.Podotchet,
  id_shartnomalar_organization: 0,
  id_spravochnik_organization: 0,
  organization_by_raschet_schet_gazna_id: 0,
  organization_by_raschet_schet_id: 0,
  opisanie: '',
  summa: 0,
  main_zarplata_id: 0,
  shartnoma_grafik_id: 0,
  childs: [
    {
      spravochnik_operatsii_id: 0,
      summa: 0
    }
  ]
}

export const KassaRasxodPodvodkaFormSchema = withPreprocessor(
  z.object({
    spravochnik_operatsii_id: z.number(),
    summa: z.number().min(1),
    id_spravochnik_podrazdelenie: z.number().optional(),
    id_spravochnik_sostav: z.number().optional(),
    id_spravochnik_type_operatsii: z.number().optional()
  })
)

export const KassaRasxodFormSchema = withPreprocessor(
  z
    .object({
      doc_num: z.string(),
      doc_date: z.string(),
      id_podotchet_litso: z.number().optional(),
      shartnoma_grafik_id: z.number().optional(),
      id_shartnomalar_organization: z.number().optional(),
      id_spravochnik_organization: z.number().optional(),
      organization_by_raschet_schet_gazna_id: z.number().optional(),
      organization_by_raschet_schet_id: z.number().optional(),
      main_zarplata_id: z.number().optional(),
      type: z.enum([RasxodType.Podotchet, RasxodType.Zarplata, RasxodType.Organ]),
      opisanie: z.string().optional(),
      summa: z.number().optional(),
      childs: z.array(KassaRasxodPodvodkaFormSchema)
    })
    .superRefine((values, ctx) => {
      if (values.type === RasxodType.Zarplata && !values.main_zarplata_id) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ['main_zarplata_id']
        })
        return
      }
      if (values.type === RasxodType.Organ && !values.id_spravochnik_organization) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ['id_spravochnik_organization']
        })
        return
      }
    })
)

export type KassaRasxodPodvodkaFormValues = z.infer<typeof KassaRasxodPodvodkaFormSchema>
export type KassaRasxodFormValues = z.infer<typeof KassaRasxodFormSchema>
