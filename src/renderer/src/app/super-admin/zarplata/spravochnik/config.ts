import { z } from 'zod'

export const ZarplataSpravochnikFormSchema = z.object({
  name: z.string().nonempty(),
  typesTypeCode: z.number().min(1),
  foiz: z.number().optional().nullable(),
  sena1: z.number().optional().nullable(),
  sena2: z.number().optional().nullable(),
  schet: z.string().optional(),
  subSchet: z.string().optional()
})
export type ZarplataSpravochnikFormValues = z.infer<typeof ZarplataSpravochnikFormSchema>

export const defaultValues: ZarplataSpravochnikFormValues = {
  name: '',
  typesTypeCode: 0,
  foiz: 0,
  sena1: 0,
  sena2: 0,
  schet: '',
  subSchet: ''
}

export enum ZarplataSpravochnikType {
  Doljnost = 1,
  VidOplaty = 2,
  VidUderzhanie = 3,
  Zvanie = 5,
  GrafikRaboty = 4,
  IstochnikFinans = 6,
  Nachislenie = 7,
  OsnovnoyUderzhanie = 8,
  Sostav = 9,
  TipOtpuska = 10,
  TipBolnichny = 11,
  TipVedomosti = 12
}
