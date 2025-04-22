import { useLocationState } from '@/common/hooks/use-location-state'
import { LogType } from '@/common/models'

export const useLogType = () => {
  return useLocationState('type', LogType.POST)
}
