import type { ReactNode } from 'react'

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
    transKey: 'pages.kassa_prixod'
  },
  {
    value: TypeSchetOperatsii.KASSA_RASXOD,
    transKey: 'pages.kassa_rasxod'
  },
  {
    value: TypeSchetOperatsii.BANK_PRIXOD,
    transKey: 'pages.bank_prixod'
  },
  {
    value: TypeSchetOperatsii.BANK_RASXOD,
    transKey: 'pages.bank_rasxod'
  },
  {
    value: TypeSchetOperatsii.AKT,
    transKey: 'pages.akt_priyom'
  },
  {
    value: TypeSchetOperatsii.POKAZAT_USLUGI,
    transKey: 'pages.pokazat_uslugi'
  },
  {
    value: TypeSchetOperatsii.AVANS_OTCHET,
    transKey: 'pages.avans'
  },
  {
    value: TypeSchetOperatsii.JUR3,
    transKey: '№3 - МО'
  },
  {
    value: TypeSchetOperatsii.JUR4,
    transKey: '№4 - МО'
  },
  {
    value: TypeSchetOperatsii.JUR7,
    transKey: '№7 - МО'
  },
  {
    value: TypeSchetOperatsii.WORK_TRIP,
    transKey: 'pages.work_trip'
  },
  {
    value: TypeSchetOperatsii.ALL,
    transKey: 'all'
  }
] as const satisfies {
  value: TypeSchetOperatsii
  transKey: ReactNode
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
