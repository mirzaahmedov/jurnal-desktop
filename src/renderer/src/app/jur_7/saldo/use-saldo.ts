import { SaldoNamespace, useSaldoController } from '@/common/features/saldo'

export const useWarehouseSaldo = () => {
  return useSaldoController({
    ns: SaldoNamespace.JUR_7
  })
}
