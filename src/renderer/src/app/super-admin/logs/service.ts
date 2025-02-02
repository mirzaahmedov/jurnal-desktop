import type { Log } from '@renderer/common/models'

import { APIEndpoints, CRUDService } from '@renderer/common/features/crud'

const logService = new CRUDService<Log>({
  endpoint: APIEndpoints.logs
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
