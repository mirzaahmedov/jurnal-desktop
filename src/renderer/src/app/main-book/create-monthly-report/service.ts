import type { CreateMonthlyReport } from '@renderer/common/models'
import { MockCRUDService } from '@renderer/common/features/crud/mock'

const createMonthlyReportService = new MockCRUDService<CreateMonthlyReport>([
  {
    id: 1,
    month: 12,
    year: 2022,
    kredit: 1000,
    debet_sum: 1000,
    type_document: 'akt'
  },
  {
    id: 2,
    month: 12,
    year: 2022,
    kredit: 2000,
    debet_sum: 2000,
    type_document: 'akt'
  },
  {
    id: 3,
    month: 12,
    year: 2022,
    kredit: 3000,
    debet_sum: 3000,
    type_document: 'akt'
  }
])

export { createMonthlyReportService }
