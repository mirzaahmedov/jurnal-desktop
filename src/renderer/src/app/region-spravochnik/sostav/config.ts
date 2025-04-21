import type { SostavFormValues } from './service'

export const SostavQueryKeys = {
  getAll: 'sostav/all',
  getById: 'sostav',
  create: 'sostav/create',
  update: 'sostav/update',
  delete: 'sostav/delete'
}

export const defaultValues: SostavFormValues = {
  name: '',
  rayon: ''
}
