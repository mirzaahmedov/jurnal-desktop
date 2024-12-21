import type { CloseMonthlyReport } from '@renderer/common/models'
import { MockCRUDService } from '@renderer/common/features/crud/mock'

const closeMonthlyReportService = new MockCRUDService<CloseMonthlyReport>([
  {
    id: 1,
    month: 12,
    year: 2020,
    status: 'approved',
    user_id: 1,
    user_id_qabul_qilgan: 1,
    yaratilgan_vaqt: '2021-06-01',
    document_qabul_qilingan_vaqt: '2021-06-01'
  },
  {
    id: 2,
    month: 1,
    year: 2021,
    status: 'approved',
    user_id: 1,
    user_id_qabul_qilgan: 1,
    yaratilgan_vaqt: '2021-06-01',
    document_qabul_qilingan_vaqt: '2021-06-01'
  },
  {
    id: 3,
    month: 2,
    year: 2021,
    status: 'approved',
    user_id: 1,
    user_id_qabul_qilgan: 1,
    yaratilgan_vaqt: '2021-06-01',
    document_qabul_qilingan_vaqt: '2021-06-01'
  }
])

export { closeMonthlyReportService }
