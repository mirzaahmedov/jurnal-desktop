import { TypeSchetOperatsii } from '@/common/models'

export const operatsiiQueryKeys = {
  getAll: 'operatsii/all',
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
    value: TypeSchetOperatsii.JUR7,
    label: 'Журнал 7'
  },
  {
    value: TypeSchetOperatsii.GENERAL,
    label: 'Общий'
  }
] as const satisfies {
  value: TypeSchetOperatsii
  label: string
}[]
