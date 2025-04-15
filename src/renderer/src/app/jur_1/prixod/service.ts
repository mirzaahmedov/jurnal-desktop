import type { PrixodType } from './config'
import type { KassaPrixod, ResponseMeta } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

interface KassaPrixodPayloadValues {
  doc_num: string
  doc_date: string
  id_podotchet_litso?: number
  organ_id?: number
  contract_id?: number
  type: PrixodType
  contract_grafik_id?: number
  organ_account_id?: number
  organ_gazna_id?: number
  main_zarplata_id?: number
  opisanie?: string
  childs: {
    spravochnik_operatsii_id: number
    id_spravochnik_podrazdelenie?: number
    id_spravochnik_sostav?: number
    id_spravochnik_type_operatsii?: number
    summa: number
  }[]
}

export const KassaPrixodService = new CRUDService<
  KassaPrixod,
  KassaPrixodPayloadValues,
  KassaPrixodPayloadValues,
  { summa: number } & ResponseMeta
>({
  endpoint: ApiEndpoints.kassa_prixod
}).use(main_schet())
