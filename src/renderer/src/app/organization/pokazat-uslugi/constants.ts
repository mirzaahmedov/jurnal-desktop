import type { PokazatUslugiForm } from './service'

export const queryKeys = {
  getById: 'pokazat-uslugi',
  getAll: 'pokazat-uslugi/all',
  create: 'pokazat-uslugi/create',
  update: 'pokazat-uslugi/update',
  delete: 'pokazat-uslugi/delete'
}

export const defaultValues: PokazatUslugiForm = {
  doc_num: '',
  doc_date: '',
  summa: 0,
  spravochnik_operatsii_own_id: 0,
  id_spravochnik_organization: 0,
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
