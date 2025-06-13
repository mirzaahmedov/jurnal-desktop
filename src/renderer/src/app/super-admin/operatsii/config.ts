import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'
import { TypeSchetOperatsii } from '@/common/models'

export const operatsiiQueryKeys = {
  getAll: 'operatsii/all',
  getSchetOptions: 'operatsii/options',
  getById: 'operatsii',
  create: 'operatsii/create',
  update: 'operatsii/update',
  delete: 'operatsii/delete'
}

export const operatsiiTypeSchetOptions = [
  {
    value: TypeSchetOperatsii.KASSA_PRIXOD,
    label: 'Касса приход'
  },
  {
    value: TypeSchetOperatsii.KASSA_RASXOD,
    label: 'Касса расход'
  },
  {
    value: TypeSchetOperatsii.BANK_PRIXOD,
    label: 'Банк приход'
  },
  {
    value: TypeSchetOperatsii.BANK_RASXOD,
    label: 'Банк расход'
  },
  {
    value: TypeSchetOperatsii.AKT,
    label: 'Акт прием-передача'
  },
  {
    value: TypeSchetOperatsii.POKAZAT_USLUGI,
    label: 'Показать услуги'
  },
  {
    value: TypeSchetOperatsii.AVANS_OTCHET,
    label: 'Аванс Отчёт'
  },
  {
    value: TypeSchetOperatsii.JUR3,
    label: 'Журнал 3'
  },
  {
    value: TypeSchetOperatsii.JUR4,
    label: 'Журнал 4'
  },
  {
    value: TypeSchetOperatsii.JUR7,
    label: 'Журнал 7'
  },
  {
    value: TypeSchetOperatsii.WORK_TRIP,
    label: 'Деловая поездка'
  },
  {
    value: TypeSchetOperatsii.ALL,
    label: 'Все'
  }
] as const satisfies {
  value: TypeSchetOperatsii
  label: string
}[]

export const OperatsiiFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    schet: z.string(),
    sub_schet: z.string().optional(),
    type_schet: z.enum([
      TypeSchetOperatsii.KASSA_PRIXOD,
      TypeSchetOperatsii.KASSA_RASXOD,
      TypeSchetOperatsii.BANK_PRIXOD,
      TypeSchetOperatsii.BANK_RASXOD,
      TypeSchetOperatsii.AKT,
      TypeSchetOperatsii.AVANS_OTCHET,
      TypeSchetOperatsii.POKAZAT_USLUGI,
      TypeSchetOperatsii.JUR3,
      TypeSchetOperatsii.JUR4,
      TypeSchetOperatsii.JUR7,
      TypeSchetOperatsii.WORK_TRIP
    ]),
    smeta_id: z.number().optional()
  })
)
export type OperatsiiFormValues = z.infer<typeof OperatsiiFormSchema>
