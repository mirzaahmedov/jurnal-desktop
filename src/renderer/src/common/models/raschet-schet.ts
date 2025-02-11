import type { Organization } from './organization'

export type RaschetSchet = {
  account_number: {
    id: number
    spravochnik_organization_id: number
    raschet_schet: string
    created_at: string
    updated_at: string
    isdeleted: boolean
  }
  organization: Omit<Organization, 'account_numbers' | 'gaznas'>
}
