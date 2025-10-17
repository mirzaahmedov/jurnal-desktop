import type { BankFormValues } from './config'
import type { ApiResponse, Bank } from '@/common/models'

import { useAsyncList } from 'react-stately'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { api } from '@/common/lib/http'

export const useAsyncListBank = () => {
  return useAsyncList<Bank>({
    async load({ signal, filterText }) {
      const response = await api.get<ApiResponse<Bank[]>>(ApiEndpoints.spravochnik_bank, {
        signal,
        params: {
          search: filterText ? filterText : undefined
        }
      })
      return {
        items: response.data.data ?? []
      }
    }
  })
}

export const BankService = new CRUDService<Bank, BankFormValues>({
  endpoint: ApiEndpoints.spravochnik_bank
})
