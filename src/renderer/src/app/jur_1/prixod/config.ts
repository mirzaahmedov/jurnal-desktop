import { z } from 'zod'
import { ZodIssueCode } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export enum PrixodType {
  Podotchet = 'podotchet',
  Zarplata = 'zarplata',
  Organ = 'organ'
}

export const KassaPrixodQueryKeys = {
  getAll: 'kassa-prixod/all',
  getById: 'kassa-prixod',
  update: 'kassa-prixod/update',
  delete: 'kassa-prixod/delete',
  create: 'kassa-prixod/create'
}

export const defaultValues: KassaPrixodFormValues = {
  doc_num: '',
  doc_date: '',
  opisanie: '',
  summa: 0,
  id_podotchet_litso: 0,
  type: PrixodType.Podotchet,
  childs: [
    {
      spravochnik_operatsii_id: 0,
      summa: 0
    }
  ]
}

export const KassaPrixodPodvodkaFormSchema = withPreprocessor(
  z.object({
    spravochnik_operatsii_id: z.number(),
    summa: z.number().min(1),
    id_spravochnik_podrazdelenie: z.number().optional(),
    id_spravochnik_sostav: z.number().optional(),
    id_spravochnik_type_operatsii: z.number().optional()
  })
)

export const KassaPrixodFormSchema = withPreprocessor(
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
      type: z.enum([PrixodType.Podotchet, PrixodType.Zarplata, PrixodType.Organ]),
      summa: z.number().optional(),
      opisanie: z.string().optional(),
      childs: z.array(KassaPrixodPodvodkaFormSchema)
    })
    .superRefine((values, ctx) => {
      if (values.type === PrixodType.Zarplata && !values.main_zarplata_id) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ['main_zarplata_id']
        })
        return
      }
      if (values.type === PrixodType.Organ && !values.id_spravochnik_organization) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ['id_spravochnik_organization']
        })
        return
      }
    })
)

export type KassaPrixodProvodkaFormValues = z.infer<typeof KassaPrixodPodvodkaFormSchema>
export type KassaPrixodFormValues = z.infer<typeof KassaPrixodFormSchema>
