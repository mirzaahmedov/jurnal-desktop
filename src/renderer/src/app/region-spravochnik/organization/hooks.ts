import { parseAsBoolean, parseAsInteger, useQueryState } from 'nuqs'

const useParentId = () => {
  return useQueryState('parent_id', parseAsInteger.withDefault(0))
}

const useCreateOpen = () => {
  return useQueryState('create_open', parseAsBoolean.withDefault(false))
}

export { useParentId, useCreateOpen }
