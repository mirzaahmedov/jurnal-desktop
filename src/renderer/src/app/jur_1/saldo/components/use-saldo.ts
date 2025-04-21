import { SaldoNamespace, useSaldoController } from '@/common/features/saldo'

export const useKassaSaldo = () => {
  return useSaldoController({
    ns: SaldoNamespace.JUR_1
  })
}
