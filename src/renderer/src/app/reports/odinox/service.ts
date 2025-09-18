import type {
  OdinoxAutoFill,
  OdinoxAutoFillSubChild,
  OdinoxType,
  OdinoxUniqueSchet
} from './details/interfaces'
import type { OdinoxMeta } from './details/utils'
import type {
  ApiResponse,
  Odinox,
  OdinoxDocument,
  OdinoxDocumentInfo,
  OdinoxProvodka
} from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

export enum DocType {
  Grafik = 0,
  BankPrixod = 1,
  Jur1Jur2Rasxod = 2,
  Jur3aAktAvans = 3,
  Remaining = 4,
  GrafikYear = 5,
  BankPrixodYear = 6,
  Jur1Jur2RasxodYear = 7,
  Jur3aAktAvansYear = 8,
  RemainingYear = 9
}

export type OdinoxPayloadChild = Omit<OdinoxAutoFillSubChild, 'id' | 'smeta_grafik'>
export interface OdinoxPayload {
  month: number
  year: number
  title: string
  title_summa: number
  title_rasxod_summa: number
  summa_from: number
  summa_to: number
  childs: Array<{
    type_id: number
    sub_childs: Array<OdinoxPayloadChild>
  }>
}
export interface GetDocsArgs {
  need_data: OdinoxProvodka[]
  smeta_id: number | string
  main_schet_id: number
  month: number
  year: number
  sort_order: number | string
  title?: boolean
}

class OdinoxServiceBuilder extends CRUDService<Odinox, OdinoxPayload, OdinoxPayload, OdinoxMeta> {
  constructor() {
    super({
      endpoint: ApiEndpoints.odinox
    })

    this.getDocs = this.getDocs.bind(this)
    this.getTypes = this.getTypes.bind(this)
    this.getSaldoCheck = this.getSaldoCheck.bind(this)
    this.getAutofillData = this.getAutofillData.bind(this)
    this.getUniqueSchets = this.getUniqueSchets.bind(this)
    this.getMainbookDocuments = this.getMainbookDocuments.bind(this)
  }

  async getDocs(values: GetDocsArgs) {
    const { need_data, ...params } = values
    const res = await this.client.post<ApiResponse<OdinoxDocument[], { summa: number }>>(
      `${this.endpoint}/docs`,
      {
        need_data
      },
      {
        params
      }
    )
    return res.data
  }
  async getAutofillData(params: { month: number; year: number; main_schet_id: number }) {
    const res = await this.client.get<ApiResponse<OdinoxAutoFill[], OdinoxMeta>>(
      `${this.endpoint}/data`,
      {
        params
      }
    )
    return res.data
  }

  async getTypes(
    ctx: QueryFunctionContext<[string, { budjet_id?: number; main_schet_id?: number }]>
  ) {
    const params = ctx.queryKey[1]
    const res = await this.client.get<ApiResponse<OdinoxType[]>>(`${this.endpoint}/type`, {
      params
    })
    return res.data
  }

  async getSaldoCheck(params: { budjet_id: number; main_schet_id: number }) {
    const res = await this.client.get<ApiResponse<unknown[]>>(`${this.endpoint}/check`, {
      headers: {
        'notify-error': false
      },
      params
    })
    return res.data
  }

  async getUniqueSchets(params: { budjet_id: number; main_schet_id: number }) {
    const res = await this.client.get<
      ApiResponse<{
        schets: OdinoxUniqueSchet[]
      }>
    >(`${this.endpoint}/unique`, {
      headers: {
        'notify-error': false
      },
      params
    })
    return res.data
  }

  async getMainbookDocuments(
    ctx: QueryFunctionContext<
      [
        string,
        {
          budjet_id: number
          main_schet_id: number
          month: number
          year: number
          type_id: number
          schet: string
          prixod: boolean
          rasxod: boolean
        }
      ]
    >
  ) {
    const params = ctx.queryKey[1]
    const res = await this.client.get<ApiResponse<OdinoxDocumentInfo[], { summa: number }>>(
      `${this.endpoint}/docs`,
      {
        params
      }
    )
    return res.data
  }
}

export const OdinoxService = new OdinoxServiceBuilder().use(main_schet())
