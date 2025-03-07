import type { Log } from '@renderer/common/models'

import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'

const logService = new CRUDService<Log>({
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

export { logService }
