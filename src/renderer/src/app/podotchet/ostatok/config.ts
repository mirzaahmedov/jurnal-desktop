import type { PodotchetOstatokFormValues } from './service'

export const podotchetOstatokQueryKeys = {
  getById: 'podotchet-saldo',
  getAll: 'podotchet-saldo/all',
  create: 'podotchet-saldo/create',
  update: 'podotchet-saldo/update',
  delete: 'podotchet-saldo/delete'
}

export const defaultValues: PodotchetOstatokFormValues = {
  doc_date: '',
  doc_num: '',
  spravochnik_podotchet_litso_id: 0,
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
