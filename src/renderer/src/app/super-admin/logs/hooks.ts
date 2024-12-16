import { parseAsStringEnum, useQueryState } from 'nuqs'

import { LogType } from '@renderer/common/models'

const useLogType = () => {
  return useQueryState(
    'type',
    parseAsStringEnum([LogType.GET, LogType.POST, LogType.PUT, LogType.DELETE]).withDefault(
      LogType.POST
    )
  )
}

export { useLogType }
