import type { ShartnomaFormValues } from './service'

export const shartnomaQueryKeys = {
  getById: 'shartnoma',
  getAll: 'shartnoma/all',
  create: 'shartnoma/create',
  update: 'shartnoma/update',
  delete: 'shartnoma/delete'
}

export const defaultValues: ShartnomaFormValues = {
  spravochnik_organization_id: 0,
  doc_num: '',
  doc_date: '',
  summa: 0,
  smeta_id: 0,
  smeta2_id: 0,
  pudratchi_bool: false,
  yillik_oylik: false,
  grafik_year: new Date().getFullYear()
}
