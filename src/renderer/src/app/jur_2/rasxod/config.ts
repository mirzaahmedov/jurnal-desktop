import type { BankRasxodFormValues } from './service'

export const queryKeys = {
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
  childs: [
    {
      spravochnik_operatsii_id: 0,
      summa: 0
    }
  ]
}
