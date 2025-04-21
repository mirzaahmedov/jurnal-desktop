import { SaldoNamespace, useSaldoController } from '@/common/features/saldo'

export const useBankSaldo = () => {
  return useSaldoController({
    ns: SaldoNamespace.JUR_2
  })
}
