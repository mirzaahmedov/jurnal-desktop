import type { OrganSaldoMonthValue } from '@/common/models'

import { SaldoNamespace, useSaldoController } from '@/common/features/saldo'

export const useAktSaldo = () => {
  return useSaldoController<OrganSaldoMonthValue>({
    ns: SaldoNamespace.JUR_3_159
  })
}
