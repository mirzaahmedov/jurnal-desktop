import type { TFunction } from 'i18next'

import { z } from 'zod'

import { PodpisTypeDocument } from '@/common/models'

export const getPodpisTypeDocumentOptions = (t: TFunction) => {
  return [
    {
      key: PodpisTypeDocument.BANK_RASXOD_PORUCHENIYA,
      name: t('podpis:documents.bank_rasxod_porucheniya')
    },
    {
      key: PodpisTypeDocument.SHARTNOMA_GRAFIK_OPLATI,
      name: t('podpis:documents.shartnoma_grafik_oplati')
    },
    {
      key: PodpisTypeDocument.CAP,
      name: t('podpis:documents.cap')
    },
    {
      key: PodpisTypeDocument.DAYS_REPORT,
      name: t('podpis:documents.days_report')
    },
    {
      key: PodpisTypeDocument.AKT_SVERKA,
      name: t('podpis:documents.akt_sverki')
    },
    {
      key: PodpisTypeDocument.JUR7_MATERIAL,
      name: t('podpis:documents.jur7_material')
    }
  ] as const
}

export const PodpisPayloadSchema = z.object({
  numeric_poryadok: z.number().min(1),
  doljnost_name: z.string().nonempty(),
  fio_name: z.string().nonempty(),
  rank: z.string().nullable(),
  type_document: z.string()
})
export type PodpisPayloadType = z.infer<typeof PodpisPayloadSchema>

export const PodpisQueryKeys = {
  getAll: 'podpis/all',
  getById: 'podpis',
  getPodpisTypes: 'podpis/types',
  create: 'podpis/create',
  update: 'podpis/update',
  delete: 'podpis/delete'
}

export const defaultValues: PodpisPayloadType = {
  numeric_poryadok: 1,
  doljnost_name: '',
  fio_name: '',
  rank: '',
  type_document: PodpisTypeDocument.BANK_RASXOD_PORUCHENIYA
}
