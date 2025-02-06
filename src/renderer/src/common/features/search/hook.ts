import { useLocationState } from '@renderer/common/hooks'

export const useSearch = () => {
  const [search] = useLocationState<string | undefined>('search')

  return {
    search: search ? search : undefined
  }
}
