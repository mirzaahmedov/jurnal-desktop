import { PodpisDoljnost, PodpisTypeDocument } from '@renderer/common/models'
import { z } from 'zod'

export const podpisDoljnostOptions = [
  {
    key: PodpisDoljnost.BOLIM_BOSHLIGI,
    name: 'Бўлим бошлиғи'
  },
  {
    key: PodpisDoljnost.BOSH_BUXGALTER,
    name: 'Бош бухгалтер'
  },
  {
    key: PodpisDoljnost.BUXGALTER,
    name: 'Бухгалтер'
  },
  {
    key: PodpisDoljnost.KASSIR,
    name: 'Кассир'
  }
] as const

export const podpisTypeDocumentOptions = [
  {
    key: PodpisTypeDocument.BANK,
    name: 'Банк отчет'
  },
  {
    key: PodpisTypeDocument.KASSA,
    name: 'Касса отчет'
  },
  {
    key: PodpisTypeDocument.ORGANIZATION_MONITORING,
    name: 'Организация мониторинг отчет'
  },
  {
    key: PodpisTypeDocument.PODOTCHET_OTCHET,
    name: 'Подотчет отчет'
  },
  {
    key: PodpisTypeDocument.MATERIAL_SKLAD,
    name: 'Материал склад отчет'
  }
] as const

const PodpisPayloadSchema = z.object({
  numeric_poryadok: z.number().min(1),
  doljnost_name: z.enum(
    [
      PodpisDoljnost.BOLIM_BOSHLIGI,
      PodpisDoljnost.BOSH_BUXGALTER,
      PodpisDoljnost.BUXGALTER,
      PodpisDoljnost.KASSIR
    ],
    {
      message: `Doljnost name must be one of: ${Object.values(PodpisDoljnost).join(', ')}`
    }
  ),
  fio_name: z.string(),
  type_document: z.enum(
    [
      PodpisTypeDocument.BANK,
      PodpisTypeDocument.KASSA,
      PodpisTypeDocument.ORGANIZATION_MONITORING,
      PodpisTypeDocument.PODOTCHET_OTCHET,
      PodpisTypeDocument.MATERIAL_SKLAD
    ],
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
  doljnost_name: PodpisDoljnost.BOLIM_BOSHLIGI,
  fio_name: '',
  type_document: PodpisTypeDocument.BANK
}

export { PodpisPayloadSchema, podpisQueryKeys, defaultValues }
export type { PodpisPayloadType }
