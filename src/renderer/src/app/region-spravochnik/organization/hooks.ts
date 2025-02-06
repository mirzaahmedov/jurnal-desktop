import { useLocationState } from '@renderer/common/hooks'

const useParentId = () => {
  return useLocationState<number | undefined>('parent_id')
}

export { useParentId }
