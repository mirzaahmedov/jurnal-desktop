import type { Organization } from './organization'

export type RaschetSchetGazna = {
  gazna: {
    id: number
    spravochnik_organization_id: number
    raschet_schet_gazna: string
    created_at: string
    updated_at: string
    isdeleted: boolean
  }
  organization: Omit<Organization, 'account_numbers' | 'gaznas'>
}
