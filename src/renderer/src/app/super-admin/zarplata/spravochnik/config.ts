import { z } from 'zod'

export const ZarplataSpravochnikFormSchema = z.object({
  name: z.string().nonempty(),
  typesTypeCode: z.number().min(1),
  spravochnikOperatsiiId: z.number().min(1),
  foiz: z.number().optional().nullable(),
  sena1: z.number().optional().nullable(),
  sena2: z.number().optional().nullable(),
  schet: z.string().optional().nullable(),
  subSchet: z.string().optional().nullable()
})
export type ZarplataSpravochnikFormValues = z.infer<typeof ZarplataSpravochnikFormSchema>

export const defaultValues: ZarplataSpravochnikFormValues = {
  name: '',
  typesTypeCode: 0,
  spravochnikOperatsiiId: 0,
  foiz: 0,
  sena1: 0,
  sena2: 0,
  schet: '',
  subSchet: ''
}
