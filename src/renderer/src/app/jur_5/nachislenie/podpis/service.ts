import type { ZarplataPodpisForm } from './config'

import { ServiceBuilder, type ServiceQueryKeys } from '@/common/features/api/service'
import { zarplataApiNew } from '@/common/lib/zarplata'

export const ZarplataQueryKeys = {
  getAll: () => ['zarplata', 'podpis'],
  getById: (id: string) => ['zarplata', 'podpis', id],
  create: () => ['zarplata', 'podpis', 'create'],
  update: (id: string) => ['zarplata', 'podpis', id, 'update'],
  delete: (id: string) => ['zarplata', 'podpis', id, 'delete']
} satisfies ServiceQueryKeys

export const ZarplataPodpisService = ServiceBuilder.createService({
  resource: 'SpravochnikPaper',
  api: zarplataApiNew
})
  .withCreate<ZarplataPodpisForm, unknown>()
  .withUpdate<ZarplataPodpisForm, unknown>()
  .withDelete<ZarplataPodpisForm>()
  .withGetAll<ZarplataPodpisForm[]>()
  .build()
