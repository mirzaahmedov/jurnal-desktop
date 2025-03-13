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
  id_spravochnik_organization: 0,
  organization_by_raschet_schet_id: 0,
  organization_by_raschet_schet_gazna_id: 0,
  shartnomalar_organization_id: 0,
  shartnoma_grafik_id: 0,
  prixod: true,
  rasxod: false,
  opisanie: '',
  childs: [
    {
      spravochnik_operatsii_id: 0,
      summa: 0
    }
  ]
}
