import type { TFunction } from 'i18next'

import { Trans } from 'react-i18next'
import { z } from 'zod'

import { PodpisDoljnost, PodpisTypeDocument } from '@/common/models'

export const PodpisDoljnostOptions = [
  {
    key: PodpisDoljnost.RUKOVODITEL,
    name: <Trans>podpis:doljnost.rukovoditel</Trans>
  },
  {
    key: PodpisDoljnost.GLAV_BUXGALTER,
    name: <Trans>podpis:doljnost.glav_buxgalter</Trans>
  },
  {
    key: PodpisDoljnost.GLAV_MIB,
    name: <Trans>podpis:doljnost.glav_mib</Trans>
  },
  {
    key: PodpisDoljnost.NACHALNIK_OTDELA,
    name: <Trans>podpis:doljnost.nachalnik_otdela</Trans>
  },
  {
    key: PodpisDoljnost.BUXGALTER,
    name: <Trans>podpis:doljnost.buxgalter</Trans>
  },
  {
    key: PodpisDoljnost.KASSIR,
    name: <Trans>podpis:doljnost.kassir</Trans>
  }
] as const

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
  doljnost_name: z.enum(
    [
      PodpisDoljnost.RUKOVODITEL,
      PodpisDoljnost.NACHALNIK_OTDELA,
      PodpisDoljnost.GLAV_BUXGALTER,
      PodpisDoljnost.GLAV_MIB,
      PodpisDoljnost.BUXGALTER,
      PodpisDoljnost.KASSIR
    ],
    {
      message: `Doljnost name must be one of: ${Object.values(PodpisDoljnost).join(', ')}`
    }
  ),
  fio_name: z.string().nonempty(),
  type_document: z.enum(
    [
      PodpisTypeDocument.BANK_RASXOD_PORUCHENIYA,
      PodpisTypeDocument.SHARTNOMA_GRAFIK_OPLATI,
      PodpisTypeDocument.DAYS_REPORT,
      PodpisTypeDocument.CAP,
      PodpisTypeDocument.AKT_SVERKA,
      PodpisTypeDocument.JUR7_MATERIAL
    ],
    {
      message: `Type document must be one of: ${Object.values(PodpisTypeDocument).join(', ')}`
    }
  )
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
  doljnost_name: PodpisDoljnost.NACHALNIK_OTDELA,
  fio_name: '',
  type_document: PodpisTypeDocument.BANK_RASXOD_PORUCHENIYA
}
