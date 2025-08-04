import type { BankRasxodFormValues } from './service'

export const BankRasxodQueryKeys = {
  getAll: 'bank-rasxod/all',
  getById: 'bank-rasxod',
  update: 'bank-rasxod/update',
  delete: 'bank-rasxod/delete',
  create: 'bank-rasxod/create'
}

export const defaultValues: BankRasxodFormValues = {
  doc_num: '',
  doc_date: '',
  opisanie: '',
  summa: 0,
  id_spravochnik_organization: 0,
  organization_by_raschet_schet_id: 0,
  contract_summa: 0,
  tulanmagan_summa: 0,
  organization_porucheniya_name: '',
  id_shartnomalar_organization: 0,
  shartnoma_grafik_id: 0,
  rukovoditel: '',
  glav_buxgalter: '',
  organization_by_raschet_schet_gazna_id: 0,
  childs: [
    {
      spravochnik_operatsii_id: 0,
      summa: 0,
      schet: '',
      schet_6: '',
      sub_schet: '',
      id_spravochnik_podotchet_litso: 0,
      id_spravochnik_podrazdelenie: 0,
      id_spravochnik_sostav: 0,
      id_spravochnik_type_operatsii: 0
    }
  ]
}
