import { SaldoNamespace, useSaldoController } from '@/common/features/saldo'

export const useMaterialSaldo = () => {
  return useSaldoController({
    ns: SaldoNamespace.JUR_7
  })
}
