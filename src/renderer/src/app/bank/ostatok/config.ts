import type { BankOstatokFormValues } from './service'

export const bankOstatokQueryKeys = {
  getById: 'bank-saldo',
  getAll: 'bank-saldo/all',
  create: 'bank-saldo/create',
  update: 'bank-saldo/update',
  delete: 'bank-saldo/delete'
}

export const defaultValues: BankOstatokFormValues = {
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
