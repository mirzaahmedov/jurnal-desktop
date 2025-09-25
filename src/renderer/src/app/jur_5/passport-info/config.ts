import { z } from 'zod'

export const MainZarplataFormSchema = z.object({
  kartochka: z.string(),
  rayon: z.string(),
  vacantId: z.number(),
  fio: z.string(),
  spravochikZarplataZvanieId: z.number(),
  xarbiy: z.boolean(),
  ostanovitRaschet: z.boolean(),
  raschetSchet: z.string().optional().nullable(),
  fioDop: z.string().optional(),
  inn: z.string(),
  bank: z.string().optional().nullable(),
  dateBirth: z.string(),
  inps: z.string(),
  spravochnikZarplataGrafikRabotiId: z.number(),
  spravochnikSostavId: z.number().optional().nullable(),
  stavka: z.number().optional().nullable(),
  nachaloSlujbi: z.string(),
  visNa1Year: z.number().optional().nullable(),
  month1: z.number().optional().nullable(),
  day1: z.number().optional().nullable(),
  itogo: z.number().optional().nullable(),
  workplaceId: z.number().optional().nullable(),
  doljnostName: z.string().optional().nullable(),
  doljnostPrikazNum: z.string().optional().nullable(),
  doljnostPrikazDate: z.string().optional().nullable(),
  spravochnikZarplataIstochnikFinanceId: z.number().optional().nullable(),
  categoryName: z.string().optional().nullable(),
  categoryNum: z.string().optional().nullable(),
  isLigota: z.boolean().catch(false)
})
export type MainZarplataFormValues = z.infer<typeof MainZarplataFormSchema>

export const AssignPositionFormSchema = z.object({
  doljnostPrikazNum: z.string().nonempty(),
  doljnostPrikazDate: z.string().nonempty(),
  workplaceId: z.number()
})
export type AssignPositionFormValues = z.infer<typeof AssignPositionFormSchema>

export const defaultAssignPositionValues: AssignPositionFormValues = {
  doljnostPrikazNum: '',
  doljnostPrikazDate: '',
  workplaceId: 0
}

export const defaultValues: MainZarplataFormValues = {
  kartochka: '',
  rayon: '',
  vacantId: 0,
  fio: '',
  spravochikZarplataZvanieId: 0,
  xarbiy: false,
  ostanovitRaschet: false,
  raschetSchet: '',
  fioDop: '',
  inn: '',
  bank: '',
  dateBirth: '',
  inps: '',
  spravochnikZarplataGrafikRabotiId: 0,
  // spravochnikSostavId: 0,
  // stavka: '',
  nachaloSlujbi: '',
  // visNa1Year: 0,
  // month1: 0,
  // day1: 0,
  // itogo: 0
  // workplaceId: 0,
  // doljnostName: '',
  // doljnostPrikazNum: '',
  // doljnostPrikazDate: ''
  // spravochnikZarplataIstochnikFinanceId: 0,
  isLigota: false
}
