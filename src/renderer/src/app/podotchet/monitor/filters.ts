import { useLocationState } from '@/common/hooks'

export const useOperatsiiFilter = () => {
  return useLocationState<undefined | number>('operatsii_id')
}
export const usePodotchetFilter = () => {
  return useLocationState<undefined | number>('podotchet_id')
}
