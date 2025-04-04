import { useLocationState } from '@/common/hooks'

export const useOperatsiiFilter = () => {
  return useLocationState<undefined | number>('operatsii_id')
}
export const useOrganFilter = () => {
  return useLocationState<undefined | number>('organ_id')
}
