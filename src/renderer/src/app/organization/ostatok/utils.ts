import type { OrganizationOstatokFormValues } from './service'

import { normalizeEmptyFields } from '@renderer/common/lib/validation'

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
  organ_id: number
  contract_id: any
  contract_grafik_id: any
  prixod: boolean
  rasxod: boolean
  organ_gazna_number_id?: number
  organ_account_number_id: number
  childs: Array<OrganizationOstatokPayloadChild>
}

export const createRequestPayload = ({
  doc_date,
  doc_num,
  id_spravochnik_organization,
  organization_by_raschet_schet_id,
  organization_by_raschet_schet_gazna_id,
  shartnomalar_organization_id,
  shartnoma_grafik_id,
  opisanie,
  prixod,
  rasxod,
  childs
}: OrganizationOstatokFormValues): OrganizationOstatokPayload => {
  return {
    doc_date,
    doc_num,
    organ_id: id_spravochnik_organization,
    organ_account_number_id: organization_by_raschet_schet_id,
    organ_gazna_number_id: organization_by_raschet_schet_gazna_id,
    prixod,
    rasxod,
    contract_id: shartnomalar_organization_id,
    contract_grafik_id: shartnoma_grafik_id,
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
  organ_id,
  organ_account_number_id,
  organ_gazna_number_id,
  contract_id,
  contract_grafik_id,
  prixod,
  rasxod,
  opisanie,
  childs
}: OrganizationOstatokPayload): OrganizationOstatokFormValues => {
  return {
    doc_num,
    doc_date,
    id_spravochnik_organization: organ_id,
    organization_by_raschet_schet_id: organ_account_number_id,
    organization_by_raschet_schet_gazna_id: organ_gazna_number_id,
    shartnomalar_organization_id: contract_id,
    shartnoma_grafik_id: Number(contract_grafik_id),
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
