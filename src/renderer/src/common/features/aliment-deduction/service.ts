import { http } from '@/common/lib/http'

export class AlimentDeductionService {
  static endpoint = 'AlimentDeduction'

  static QueryKeys = {
    GetById: 'AlimentDeduction/:id'
  }

  static async getById(id: number) {
    const res = await http.get(`${AlimentDeductionService.endpoint}/${id}`)
    return res.data
  }
}
