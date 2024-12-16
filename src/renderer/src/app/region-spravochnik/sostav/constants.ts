import { SostavForm } from './service'

export const sostavQueryKeys = {
  getAll: 'sostav/all',
  getById: 'sostav',
  create: 'sostav/create',
  update: 'sostav/update',
  delete: 'sostav/delete'
}

export const defaultValues: SostavForm = {
  name: '',
  rayon: ''
}
