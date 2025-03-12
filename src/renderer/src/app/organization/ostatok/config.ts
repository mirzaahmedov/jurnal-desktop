import type { OrganizationOstatokFormValues } from './service'

export const organOstatokQueryKeys = {
  getById: 'organ-saldo',
  getAll: 'organ-saldo/all',
  create: 'organ-saldo/create',
  update: 'organ-saldo/update',
  delete: 'organ-saldo/delete'
}

export const defaultValues: OrganizationOstatokFormValues = {
  doc_date: '',
  doc_num: '',
  organ_id: 0,
  organization_by_raschet_schet_id: 0,
  organ_account_number_id: 0,
  organ_gazna_number_id: 0,
  contract_id: 0,
  contract_grafik_id: 0,
  prixod: true,
  rasxod: false,
  childs: [
    {
      operatsii_id: 71,
      summa: 50
    }
  ]
}
