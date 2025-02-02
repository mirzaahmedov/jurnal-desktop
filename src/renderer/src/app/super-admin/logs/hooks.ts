import { LogType } from '@renderer/common/models'
import { parseAsStringEnum, useQueryState } from 'nuqs'

const useLogType = () => {
  return useQueryState(
    'type',
    parseAsStringEnum([LogType.GET, LogType.POST, LogType.PUT, LogType.DELETE]).withDefault(
      LogType.POST
    )
  )
}

export { useLogType }
