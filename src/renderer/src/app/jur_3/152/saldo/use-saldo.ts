import type { OrganSaldoMonthValue } from '@/common/models'

import { SaldoNamespace, useSaldoController } from '@/common/features/saldo'

export const useUslugiSaldo = () => {
  return useSaldoController<OrganSaldoMonthValue>({
    ns: SaldoNamespace.JUR_3_152
  })
}
