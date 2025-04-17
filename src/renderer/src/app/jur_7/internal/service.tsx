import type { InternalFormValues } from './config'
import type { Internal } from '@/common/models'

import { useMutation, useQuery } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'

import { internalQueryKeys } from './config'

export const internalService = new CRUDService<Internal, InternalFormValues>({
  endpoint: ApiEndpoints.jur7_internal
})
  .use(budjet())
  .use(main_schet())

export const useInternalGet = (id: number) => {
  return useQuery({
    queryKey: [internalQueryKeys.get, id],
    queryFn: internalService.getById,
    enabled: !!id
  })
}

type UseInternalCreateParams = {
  onSuccess?: (res: any) => void
  onError?: (res: any) => void
}
export const useInternalCreate = ({ onSuccess, onError }: UseInternalCreateParams) => {
  return useMutation({
    mutationKey: [internalQueryKeys.create],
    mutationFn: internalService.create,
    onSuccess,
    onError
  })
}

export const useInternalUpdate = ({ onSuccess, onError }: UseInternalCreateParams) => {
  return useMutation({
    mutationKey: [internalQueryKeys.update],
    mutationFn: internalService.update,
    onSuccess,
    onError
  })
}
export const useInternalDelete = ({ onSuccess, onError }: UseInternalCreateParams) => {
  return useMutation({
    mutationKey: [internalQueryKeys.delete],
    mutationFn: internalService.delete,
    onSuccess,
    onError
  })
}
