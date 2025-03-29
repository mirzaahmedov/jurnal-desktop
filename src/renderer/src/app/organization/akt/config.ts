import type { AktFormValues } from './service'

export const queryKeys = {
  getById: 'akt',
  getAll: 'akt/all',
  create: 'akt/create',
  update: 'akt/update',
  delete: 'akt/delete'
}

export const defaultValues: AktFormValues = {
  doc_num: '',
  doc_date: '',
  summa: 0,
  id_spravochnik_organization: 0,
  organization_by_raschet_schet_id: 0,
  childs: [
    {
      spravochnik_operatsii_id: 0,
      kol: 0,
      sena: 0,
      nds_foiz: 0,
      id_spravochnik_podrazdelenie: 0,
      id_spravochnik_sostav: 0,
      id_spravochnik_type_operatsii: 0
    }
  ]
}
