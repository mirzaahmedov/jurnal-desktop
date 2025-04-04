import type { BankOstatokFormValues } from './service'

import { normalizeEmptyFields } from '@/common/lib/validation'

export interface BankOstatokPayloadChild {
  operatsii_id: number
  podraz_id: any
  sostav_id: any
  type_operatsii_id: any
  summa: number
}

export interface BankOstatokPayload {
  doc_num: string
  doc_date: string
  opisanie?: string
  prixod: boolean
  rasxod: boolean
  childs: Array<BankOstatokPayloadChild>
}

export const createRequestPayload = ({
  doc_date,
  doc_num,
  opisanie,
  prixod,
  rasxod,
  childs
}: BankOstatokFormValues): BankOstatokPayload => {
  return {
    doc_date,
    doc_num,
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
  prixod,
  rasxod,
  opisanie,
  childs
}: BankOstatokPayload): BankOstatokFormValues => {
  return {
    doc_num,
    doc_date,
    opisanie,
    prixod,
    rasxod,
    childs: childs.map(({ operatsii_id, summa, podraz_id, sostav_id, type_operatsii_id }) => ({
      spravochnik_operatsii_id: operatsii_id,
      summa,
      id_spravochnik_podrazdelenie: podraz_id,
      id_spravochnik_sostav: sostav_id,
      id_spravochnik_type_operatsii: type_operatsii_id
    }))
  }
}
