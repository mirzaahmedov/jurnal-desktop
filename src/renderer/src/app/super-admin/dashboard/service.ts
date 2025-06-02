import type { ApiResponse, Budjet } from '@/common/models'

import { ApiEndpoints } from '@/common/features/crud'
import { http } from '@/common/lib/http'

export class AdminDashboardService {
  static QueryKeys = {
    GetBudjets: 'admin/dashboard/budjet'
  }

  static async getBudjets() {
    const res = await http.get<ApiResponse<Budjet[]>>(`${ApiEndpoints.admin_dashboard}/budjet`)
    return res.data
  }
}
