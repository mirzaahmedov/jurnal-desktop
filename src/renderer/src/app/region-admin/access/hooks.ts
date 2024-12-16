import { parseAsInteger, useQueryState } from 'nuqs'

const useRoleId = () => {
  return useQueryState('role_id', parseAsInteger.withDefault(0))
}

export { useRoleId }
