import type { PrixodPayloadType } from './service'

export const queryKeys = {
  getAll: 'kassa-prixod/all',
  getById: 'kassa-prixod',
  update: 'kassa-prixod/update',
  delete: 'kassa-prixod/delete',
  create: 'kassa-prixod/create'
}

export const defaultValues: PrixodPayloadType = {
  doc_num: '',
  doc_date: '',
  opisanie: '',
  summa: 0,
  id_podotchet_litso: 0,
  is_zarplata: false,
  childs: [
    {
      spravochnik_operatsii_id: 0,
      summa: 0
    }
  ]
}
