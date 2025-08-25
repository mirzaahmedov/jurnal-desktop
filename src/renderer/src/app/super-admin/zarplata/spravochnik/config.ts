import { z } from 'zod'

export const ZarplataSpravochnikFormSchema = z.object({
  name: z.string().nonempty(),
  typeCode: z.number(),
  typesTypeCode: z.number().min(1),
  foiz: z.number().optional().nullable(),
  sena1: z.number().optional().nullable(),
  sena2: z.number().optional().nullable(),
  schet: z.string().optional(),
  subSchet: z.string().optional(),
  isPoek: z.boolean().optional().nullable()
})
export type ZarplataSpravochnikFormValues = z.infer<typeof ZarplataSpravochnikFormSchema>

export const defaultValues: ZarplataSpravochnikFormValues = {
  name: '',
  typeCode: 0,
  typesTypeCode: 0,
  foiz: 0,
  sena1: 0,
  sena2: 0,
  schet: '',
  subSchet: '',
  isPoek: false
}

export enum ZarplataSpravochnikType {
  Doljnost = 1,
  Zvanie = 5,
  IstochnikFinans = 6,
  Sostav = 9,
  GrafikRaboty = 11
}
