import type { PodotchetSaldoMonthValue } from '@/common/models'

import { SaldoNamespace, useSaldoController } from '@/common/features/saldo'

export const usePodotchetSaldo = () => {
  return useSaldoController<PodotchetSaldoMonthValue>({
    ns: SaldoNamespace.JUR_4
  })
}
