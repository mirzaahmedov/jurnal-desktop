import { parseAsInteger, useQueryState } from 'nuqs'

const useParentId = () => {
  return useQueryState('parent_id', parseAsInteger.withDefault(0))
}

export { useParentId }
