import type { ApiResponse } from '@/common/models'

import { http } from '@/common/lib/http'

export interface PersonInformation {
  transaction_id: number
  current_pinpp: string
  pinpps: string[]
  current_document: string
  documents: Document[]
  surnamelat: string
  namelat: string
  patronymlat: string
  birth_date: string
  birthplace: string
  birthcountry: string
  birthcountryid: number
  livestatus: number
  nationality: null
  nationalityid: null
  citizenship: string
  citizenshipid: number
  sex: number
  photo: string
}
interface Document {
  document: string
  type: string
  docgiveplace: string
  docgiveplaceid: number
  datebegin: string
  dateend: null | string
  status: number
}

export class PersonService {
  static endpoint = '/int/person'

  static async getByPnfl(values: { pinpp: string; birth_date: string }) {
    const res = await http.post<ApiResponse<PersonInformation[]>>(
      `${PersonService.endpoint}/by-pnfl`,
      values
    )
    return res.data
  }
}
