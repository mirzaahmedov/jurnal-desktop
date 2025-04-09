import type { BankPrixodFormValues } from './service'

export const BankPrixodQueryKeys = {
  getAll: 'bank-prixod/all',
  getById: 'bank-prixod',
  update: 'bank-prixod/update',
  delete: 'bank-prixod/delete',
  create: 'bank-prixod/create'
}

export const defaultValues: BankPrixodFormValues = {
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
