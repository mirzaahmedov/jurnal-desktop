import { useLocationState } from '@/common/hooks/use-location-state'
import { LogType } from '@/common/models'

const useLogType = () => {
  return useLocationState('type', LogType.POST)
}

export { useLogType }
