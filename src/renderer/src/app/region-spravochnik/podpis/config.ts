import type { TFunction } from 'i18next'

import { PodpisDoljnost, PodpisTypeDocument } from '@renderer/common/models'
import { z } from 'zod'

export const getPodpisDoljnostOptions = (t: TFunction) => {
  return [
    {
      key: PodpisDoljnost.RUKOVODITEL,
      name: t('podpis:doljnost.rukovoditel')
    },
    {
      key: PodpisDoljnost.GLAV_BUXGALTER,
      name: t('podpis:doljnost.glav_buxgalter')
    },
    {
      key: PodpisDoljnost.NACHALNIK_OTDELA,
      name: t('podpis:doljnost.nachalnik_otdela')
    },
    {
      key: PodpisDoljnost.BUXGALTER,
      name: t('podpis:doljnost.buxgalter')
    },
    {
      key: PodpisDoljnost.KASSIR,
      name: t('podpis:doljnost.kassir')
    }
  ] as const
}

export const getPodpisTypeDocumentOptions = (t: TFunction) => {
  return [
    {
      key: PodpisTypeDocument.BANK_RASXOD_PORUCHENIYA,
      name: t('podpis:documents.bank_rasxod_porucheniya')
    },
    {
      key: PodpisTypeDocument.SHARTNOMA_GRAFIK_OPLATI,
      name: t('podpis:documents.shartnoma_grafik_oplati')
    }
  ] as const
}

const PodpisPayloadSchema = z.object({
  numeric_poryadok: z.number().min(1),
  doljnost_name: z.enum(
    [
      PodpisDoljnost.RUKOVODITEL,
      PodpisDoljnost.NACHALNIK_OTDELA,
      PodpisDoljnost.GLAV_BUXGALTER,
      PodpisDoljnost.BUXGALTER,
      PodpisDoljnost.KASSIR
    ],
    {
      message: `Doljnost name must be one of: ${Object.values(PodpisDoljnost).join(', ')}`
    }
  ),
  fio_name: z.string(),
  type_document: z.enum(
    [PodpisTypeDocument.BANK_RASXOD_PORUCHENIYA, PodpisTypeDocument.SHARTNOMA_GRAFIK_OPLATI],
    {
      message: `Type document must be one of: ${Object.values(PodpisTypeDocument).join(', ')}`
    }
  )
})
type PodpisPayloadType = z.infer<typeof PodpisPayloadSchema>

const podpisQueryKeys = {
  getAll: 'podpis/all',
  getById: 'podpis',
  create: 'podpis/create',
  update: 'podpis/update',
  delete: 'podpis/delete'
}

const defaultValues: PodpisPayloadType = {
  numeric_poryadok: 1,
  doljnost_name: PodpisDoljnost.NACHALNIK_OTDELA,
  fio_name: '',
  type_document: PodpisTypeDocument.BANK_RASXOD_PORUCHENIYA
}

export { PodpisPayloadSchema, podpisQueryKeys, defaultValues }
export type { PodpisPayloadType }
