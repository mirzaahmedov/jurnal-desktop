import type { InternalTransferFormType } from './config'
import type { InternalTransfer } from '@/common/models'

import { useMutation, useQuery } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

import { internalQueryKeys } from './config'

export const internalService = new CRUDService<InternalTransfer, InternalTransferFormType>({
  endpoint: ApiEndpoints.jur7_internal
}).use(main_schet())

export const useInternalTransferGet = (id: number) => {
  return useQuery({
    queryKey: [internalQueryKeys.get, id],
    queryFn: internalService.getById,
    enabled: !!id
  })
}

type UseInternalTransferCreateParams = {
  onSuccess?: (res: any) => void
  onError?: (res: any) => void
}
export const useInternalTransferCreate = ({
  onSuccess,
  onError
}: UseInternalTransferCreateParams) => {
  return useMutation({
    mutationKey: [internalQueryKeys.create],
    mutationFn: internalService.create,
    onSuccess,
    onError
  })
}

export const useInternalTransferUpdate = ({
  onSuccess,
  onError
}: UseInternalTransferCreateParams) => {
  return useMutation({
    mutationKey: [internalQueryKeys.update],
    mutationFn: internalService.update,
    onSuccess,
    onError
  })
}
export const useInternalTransferDelete = ({
  onSuccess,
  onError
}: UseInternalTransferCreateParams) => {
  return useMutation({
    mutationKey: [internalQueryKeys.delete],
    mutationFn: internalService.delete,
    onSuccess,
    onError
  })
}
