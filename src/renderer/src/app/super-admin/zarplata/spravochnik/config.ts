import { z } from 'zod'

export const ZarplataSpravochnikFormSchema = z.object({
  name: z.string().nonempty(),
  typesTypeCode: z.number().min(1),
  spravochnikOperatsiiId: z.number().min(1),
  foiz: z.number(),
  sena1: z.number(),
  sena2: z.number(),
  schet: z.string(),
  subSchet: z.string()
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
