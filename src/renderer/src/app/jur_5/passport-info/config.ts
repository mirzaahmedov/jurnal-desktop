import { z } from 'zod'

export const MainZarplataFormSchema = z.object({
  kartochka: z.string(),
  rayon: z.string(),
  vacantId: z.number(),
  fio: z.string(),
  spravochikZarplataZvanieId: z.number(),
  xarbiy: z.boolean(),
  ostanovitRaschet: z.boolean(),
  raschetSchet: z.string().optional(),
  fioDop: z.string().optional(),
  inn: z.string(),
  bank: z.string().optional(),
  dateBirth: z.string(),
  inps: z.string(),
  spravochnikZarplataGrafikRabotiId: z.number(),
  spravochnikSostavId: z.number().optional(),
  stavka: z.string().optional(),
  nachaloSlujbi: z.string(),
  visNa1Year: z.number().optional(),
  month1: z.number().optional(),
  day1: z.number().optional(),
  itogo: z.number().optional(),
  workplaceId: z.number().optional(),
  doljnostName: z.string().optional(),
  doljnostPrikazNum: z.string().optional(),
  doljnostPrikazDate: z.string().optional(),
  spravochnikZarplataIstochnikFinanceId: z.number().optional()
})
export type MainZarplataFormValues = z.infer<typeof MainZarplataFormSchema>

export const defaultValues: MainZarplataFormValues = {
  kartochka: '',
  rayon: '',
  vacantId: 0,
  fio: '',
  spravochikZarplataZvanieId: 0,
  xarbiy: false,
  ostanovitRaschet: false,
  // raschetSchet: '',
  // fioDop: '',
  inn: '',
  // bank: '',
  dateBirth: '',
  inps: '',
  spravochnikZarplataGrafikRabotiId: 0,
  // spravochnikSostavId: 0,
  // stavka: '',
  nachaloSlujbi: ''
  // visNa1Year: 0,
  // month1: 0,
  // day1: 0,
  // itogo: 0
  // workplaceId: 0,
  // doljnostName: '',
  // doljnostPrikazNum: '',
  // doljnostPrikazDate: ''
  // spravochnikZarplataIstochnikFinanceId: 0
}
