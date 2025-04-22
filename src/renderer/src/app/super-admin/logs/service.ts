import type { Log } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export const LogService = new CRUDService<Log>({
  endpoint: ApiEndpoints.logs
}).forRequest((type, args) => {
  if (type === 'getAll') {
    const { params } = args.config
    delete params.onChange
    return {
      url: 'log/get'
    }
  }
  return {}
})
