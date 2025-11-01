import type { TwoFSaldoFormValues } from './config'
import type { ApiResponse } from '@/common/models'

import { getMainSchetId } from '@/common/features/requisites'
import { api } from '@/common/lib/http'

export class TwoFSaldoService {
  static endpoint = '/f2/saldo'

  static async checkSaldo({ main_schet_id }: { main_schet_id: number }) {
    const res = await api.get<ApiResponse<{ year: number }>>(`${TwoFSaldoService.endpoint}/check`, {
      params: {
        main_schet_id
      }
    })
    return res.data
  }

  static async getAll({ year, main_schet_id }: { year: number; main_schet_id: number }) {
    const res = await api.get<
      ApiResponse<
        {
          id: number
          smeta_id: number
          smeta_number: string
          year: number
          created_at: string
          updated_at: string
          isdeleted: boolean
          main_schet_id: number
          bank_prixod: number
          jur1_jur2_rasxod: number
          jur3a_akt_avans: number
        }[]
      >
    >(TwoFSaldoService.endpoint, {
      params: {
        main_schet_id,
        year
      }
    })
    return res.data
  }

  static async create({ year, month, smetas }: TwoFSaldoFormValues) {
    const res = await api.post<ApiResponse<unknown>>(
      TwoFSaldoService.endpoint,
      {
        smetas
      },
      {
        params: {
          main_schet_id: getMainSchetId(),
          month,
          year
        }
      }
    )
    return res.data
  }

  static async update({ year, month, smetas }: TwoFSaldoFormValues) {
    const res = await api.put(
      TwoFSaldoService.endpoint,
      {
        smetas
      },
      {
        params: {
          main_schet_id: getMainSchetId(),
          month,
          year
        }
      }
    )
    return res.data
  }

  static async delete({ year }: { year: number }) {
    const res = await api.delete(TwoFSaldoService.endpoint, {
      params: {
        main_schet_id: getMainSchetId(),
        year
      }
    })
    return res.data
  }
}
