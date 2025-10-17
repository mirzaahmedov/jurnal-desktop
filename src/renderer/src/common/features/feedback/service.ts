import type { FeedbackForm } from './config'
import type { IFeedBack } from './model'

import { ServiceBuilder } from '@/common/features/api/service'
import { api } from '@/common/lib/http'

export const FeedbackQueryKeys = {
  getAll: () => ['feedback', 'getAll'] as const,
  getById: (id: number) => ['feedback', 'getById', id] as const,
  create: () => ['feedback', 'create'] as const,
  update: (id: number) => ['feedback', 'update', id] as const,
  delete: (id: number) => ['feedback', 'delete', id] as const
}

export const FeedbackService = ServiceBuilder.createService({
  resource: '/general/error',
  api
})
  .withCreate<FeedbackForm, void>()
  .withGetAll<IFeedBack[]>()
  .build()
