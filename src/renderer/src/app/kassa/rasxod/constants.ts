import type { RasxodPayloadType } from './service'

export const queryKeys = {
  getAll: 'kassa-rasxod/all',
  getById: 'kassa-rasxod',
  update: 'kassa-rasxod/update',
  delete: 'kassa-rasxod/delete',
  create: 'kassa-rasxod/create'
}

export const defaultValues: RasxodPayloadType = {
  doc_num: '',
  doc_date: '',
  id_podotchet_litso: 0,
  is_zarplata: false,
  childs: [
    {
      spravochnik_operatsii_id: 0,
      summa: 0
    }
  ]
}
