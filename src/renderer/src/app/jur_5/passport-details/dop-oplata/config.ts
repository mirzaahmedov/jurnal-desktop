import { z } from 'zod'

export const DopOplataFormSchema = z.object({
  docNum: z.string(),
  docDate: z.string(),
  mainZarplataId: z.number(),
  spravochnikZarplataId: z.number(),
  typesSpravochnikZarplataId: z.number(),
  vidUder: z.string(),
  elements: z.string(),
  razmer: z.number(),
  summa: z.number(),
  srok: z.string(),
  stop: z.boolean(),
  typesTypeCode: z.number(),
  typesName: z.string(),
  typeName: z.string(),
  typeCode: z.number(),
  childs: z.array(
    z.object({
      name: z.string(),
      period: z.number(),
      summa: z.number()
    })
  )
})
export type DopOplataFormValues = z.infer<typeof DopOplataFormSchema>

export const defaultValues: DopOplataFormValues = {
  docNum: '',
  docDate: '',
  mainZarplataId: 0,
  spravochnikZarplataId: 0,
  typesSpravochnikZarplataId: 0,
  vidUder: '',
  elements: '',
  razmer: 0,
  summa: 0,
  srok: '',
  stop: false,
  typesTypeCode: 0,
  typesName: '',
  typeName: '',
  typeCode: 0,
  childs: []
}
