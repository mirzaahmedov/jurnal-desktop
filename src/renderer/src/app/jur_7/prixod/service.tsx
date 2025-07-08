import type {
  ApiResponse,
  ApiResponseMeta,
  MaterialPrixod,
  MaterialPrixodProduct
} from '@/common/models'
import type { QueryFunctionContext, UseMutationOptions } from '@tanstack/react-query'

import { useMutation } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'

import { type MaterialPrixodFormValues, MaterialPrixodQueryKeys } from './config'

interface MaterialPrixodMeta extends ApiResponseMeta {
  summa: number
}

export class MaterialPrixodServiceFactory extends CRUDService<
  MaterialPrixod,
  MaterialPrixodFormValues,
  MaterialPrixodFormValues,
  MaterialPrixodMeta
> {
  constructor() {
    super({
      endpoint: ApiEndpoints.jur7_prixod
    })

    this.getProducts = this.getProducts.bind(this)
  }

  async getProducts(
    ctx: QueryFunctionContext<
      [
        string,
        {
          page: number
          limit: number
          budjet_id: number
          main_schet_id: number
          responsible_id?: number
        }
      ]
    >
  ) {
    const res = await this.client.get<ApiResponse<MaterialPrixodProduct[]>>(
      `${this.endpoint}/products`,
      {
        params: ctx.queryKey[1]
      }
    )
    return res.data
  }
}

export const MaterialPrixodService = new MaterialPrixodServiceFactory()
  .use(budjet())
  .use(main_schet())

export type UsePrixodParams = Pick<UseMutationOptions<any, Error, any>, 'onSuccess' | 'onError'>
export const usePrixodCreate = ({ onSuccess, onError }: UsePrixodParams) => {
  return useMutation({
    mutationKey: [MaterialPrixodQueryKeys.create],
    mutationFn: MaterialPrixodService.create,
    onSuccess,
    onError
  })
}
export const usePrixodUpdate = ({ onSuccess, onError }: UsePrixodParams) => {
  return useMutation({
    mutationKey: [MaterialPrixodQueryKeys.update],
    mutationFn: MaterialPrixodService.update,
    onSuccess,
    onError
  })
}
