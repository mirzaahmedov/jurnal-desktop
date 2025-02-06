import { useLocationState } from '@renderer/common/hooks/use-location-state'
import { LogType } from '@renderer/common/models'

const useLogType = () => {
  return useLocationState('type', LogType.POST)
}

export { useLogType }
