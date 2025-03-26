import type { KassaOstatokFormValues } from './service'

export const kassaOstatokQueryKeys = {
  getById: 'kassa-saldo',
  getAll: 'kassa-saldo/all',
  create: 'kassa-saldo/create',
  update: 'kassa-saldo/update',
  delete: 'kassa-saldo/delete'
}

export const defaultValues: KassaOstatokFormValues = {
  doc_date: '',
  doc_num: '',
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
