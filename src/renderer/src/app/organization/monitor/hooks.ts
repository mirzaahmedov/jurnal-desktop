import { parseAsInteger, useQueryState } from 'nuqs'

const useOrgId = () => {
  return useQueryState('org_id', parseAsInteger.withDefault(0))
}
const useOperatsiiId = () => {
  return useQueryState('operatsii_id', parseAsInteger.withDefault(0))
}

export { useOrgId, useOperatsiiId }
