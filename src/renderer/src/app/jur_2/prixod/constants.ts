import type { PrixodPayloadType } from './service'

export const queryKeys = {
  getAll: 'bank-prixod/all',
  getById: 'bank-prixod',
  update: 'bank-prixod/update',
  delete: 'bank-prixod/delete',
  create: 'bank-prixod/create'
}

export const defaultValues: PrixodPayloadType = {
  doc_num: '',
  doc_date: '',
  opisanie: '',
  summa: 0,
  id_spravochnik_organization: 0,
  childs: [
    {
      spravochnik_operatsii_id: 0,
      summa: 0
    }
  ]
}
