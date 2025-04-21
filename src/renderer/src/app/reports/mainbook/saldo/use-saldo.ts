import type { MainbookSaldoMonthValue } from '@/common/models'

import { SaldoNamespace, useSaldoController } from '@/common/features/saldo'

export const useMainbookSaldo = () => {
  return useSaldoController<MainbookSaldoMonthValue>({
    ns: SaldoNamespace.MAINBOOK
  })
}
