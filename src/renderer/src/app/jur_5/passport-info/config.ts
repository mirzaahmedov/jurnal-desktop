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
  fioDop: z.string().optional().nullable(),
  inn: z.string(),
  bank: z.string().optional().nullable(),
  dateBirth: z.string(),
  inps: z.string(),
  spravochnikZarplataGrafikRabotiId: z.number(),
  spravochnikSostavId: z.number().optional().nullable(),
  stavka: z.string().optional().nullable(),
  nachaloSlujbi: z.string(),
  visNa1Year: z.number().optional().nullable(),
  month1: z.number().optional().nullable(),
  day1: z.number().optional().nullable(),
  itogo: z.number().optional().nullable(),
  workplaceId: z.number().optional().nullable(),
  doljnostName: z.string().optional().nullable(),
  doljnostPrikazNum: z.string().optional().nullable(),
  doljnostPrikazDate: z.string().optional().nullable(),
  spravochnikZarplataIstochnikFinanceId: z.number().optional().nullable()
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
