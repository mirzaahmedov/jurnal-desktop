import type { ShartnomaFormValues } from './service'
import type { Shartnoma } from '@renderer/common/models'

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
  grafik_year: new Date().getFullYear(),
  grafiks: [
    {
      oy_1: 0,
      oy_2: 0,
      oy_3: 0,
      oy_4: 0,
      oy_5: 0,
      oy_6: 0,
      oy_7: 0,
      oy_8: 0,
      oy_9: 0,
      oy_10: 0,
      oy_11: 0,
      oy_12: 0
    }
  ]
}

export interface LocationState {
  orgId: number
  original?: Shartnoma
}
