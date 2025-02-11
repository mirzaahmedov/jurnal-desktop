import type { RaschetSchetFormValues } from './service'

export const raschetSchetQueryKeys = {
  getAll: 'raschet-schet/all',
  getById: 'raschet-schet',
  create: 'raschet-schet/create',
  update: 'raschet-schet/update',
  delete: 'raschet-schet/delete'
}

export const defaultValues: RaschetSchetFormValues = {
  raschet_schet: ''
}
