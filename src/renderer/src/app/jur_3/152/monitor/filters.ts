import { useLocationState } from '@/common/hooks'

export const useOperatsiiFilter = () => {
  return useLocationState<undefined | number>('operatsii_id')
}
export const useOrganFilter = () => {
  return useLocationState<undefined | number>('organ_id')
}
export const useContractFilter = () => {
  return useLocationState<undefined | number>('contract_id')
}
