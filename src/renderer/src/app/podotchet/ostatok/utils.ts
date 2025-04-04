import type { PodotchetOstatokFormValues } from './service'

import { normalizeEmptyFields } from '@/common/lib/validation'

export interface OrganizationOstatokPayloadChild {
  operatsii_id: number
  podraz_id: any
  sostav_id: any
  type_operatsii_id: any
  summa: number
}

export interface OrganizationOstatokPayload {
  doc_num: string
  doc_date: string
  opisanie?: string
  podotchet_id: number
  prixod: boolean
  rasxod: boolean
  childs: Array<OrganizationOstatokPayloadChild>
}

export const createRequestPayload = ({
  doc_date,
  doc_num,
  spravochnik_podotchet_litso_id,
  opisanie,
  prixod,
  rasxod,
  childs
}: PodotchetOstatokFormValues): OrganizationOstatokPayload => {
  return {
    doc_date,
    doc_num,
    podotchet_id: spravochnik_podotchet_litso_id,
    prixod,
    rasxod,
    opisanie,
    childs: childs
      .map(normalizeEmptyFields)
      .map(
        ({
          spravochnik_operatsii_id,
          summa,
          id_spravochnik_podrazdelenie,
          id_spravochnik_sostav,
          id_spravochnik_type_operatsii
        }) => ({
          operatsii_id: spravochnik_operatsii_id,
          summa,
          podraz_id: id_spravochnik_podrazdelenie,
          sostav_id: id_spravochnik_sostav,
          type_operatsii_id: id_spravochnik_type_operatsii
        })
      )
  }
}

export const parseResponseData = ({
  doc_num,
  doc_date,
  podotchet_id,
  prixod,
  rasxod,
  opisanie,
  childs
}: OrganizationOstatokPayload): PodotchetOstatokFormValues => {
  return {
    doc_num,
    doc_date,
    opisanie,
    prixod,
    rasxod,
    spravochnik_podotchet_litso_id: podotchet_id,
    childs: childs.map(({ operatsii_id, summa, podraz_id, sostav_id, type_operatsii_id }) => ({
      spravochnik_operatsii_id: operatsii_id,
      summa,
      id_spravochnik_podrazdelenie: podraz_id,
      id_spravochnik_sostav: sostav_id,
      id_spravochnik_type_operatsii: type_operatsii_id
    }))
  }
}
