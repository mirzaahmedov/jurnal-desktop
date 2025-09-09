import type { OtdelniyRaschetFormValues } from './config'
import type {
  OtdelniyRaschetDeductionDto,
  OtdelniyRaschetPaymentDto
} from '@/common/models/otdelniy-raschet'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { zarplataApiNew } from '@/common/lib/zarplata_new'

// Define the type for OtdelniyRaschet model
export interface OtdelniyRaschet {
  id: number
  spravochnikBudjetNameId: number
  mainSchetId: number
  nachislenieYear: number
  nachislenieMonth: number
  docNum: number
  docDate: string
  mainZarplataId: number
  rabDni: number
  otrabDni: number
  noch: number
  prazdnik: number
  pererabodka: number
  kazarma: number
  createdAt?: string
  updatedAt?: string
  otdelniyRaschetPaymentDtos: OtdelniyRaschetPaymentDto[]
  otdelniyRaschetDeductionDtos: OtdelniyRaschetDeductionDto[]
}

export class OtdelniyRaschetService {
  static endpoint = 'OtdelniyRaschet'

  static QueryKeys = {
    GetByMainZarplataId: 'OtdelniyRaschet/get-by-mainId'
  }

  static async getAll(
    ctx: QueryFunctionContext<
      [
        typeof OtdelniyRaschetService.QueryKeys.GetByMainZarplataId,
        number,
        {
          year: number
          month: number
        }
      ]
    >
  ) {
    const mainZarplataId = ctx.queryKey[1]
    const { year, month } = ctx.queryKey[2]
    const res = await zarplataApiNew.get<OtdelniyRaschet[]>(
      `${OtdelniyRaschetService.endpoint}/${mainZarplataId}?year=${year}&month=${month}`
    )
    return res.data
  }

  static async create(values: OtdelniyRaschetFormValues) {
    const res = await zarplataApiNew.post(`${OtdelniyRaschetService.endpoint}`, values)
    return res.data
  }

  static async update(args: { id: number; values: OtdelniyRaschetFormValues }) {
    const res = await zarplataApiNew.put(
      `${OtdelniyRaschetService.endpoint}/${args.id}`,
      args.values
    )
    return res.data
  }

  static async delete(id: number) {
    const res = await zarplataApiNew.delete(`${OtdelniyRaschetService.endpoint}/${id}`)
    return res.data
  }
}
